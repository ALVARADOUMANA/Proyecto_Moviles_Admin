// front\src\hooks\useAuth.js
import axios from 'axios';

// URL base para la API de autenticación
const AUTH_API_URL = 'https://localhost:44388/api/auth';

// Configuración base de axios para autenticación
const authConfig = {
  baseURL: AUTH_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

// Instancia de axios para autenticación
const authApi = axios.create(authConfig);

// Interceptor para agregar el token a las peticiones si existe
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error (token expirado, etc.)
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      logout();
      window.location.href = '/login';
    }
    
    // Manejar diferentes tipos de error
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      // Manejar errores de validación de ASP.NET Core
      const errors = error.response.data.errors;
      const errorMessages = [];
      
      Object.keys(errors).forEach(key => {
        if (Array.isArray(errors[key])) {
          errorMessages.push(...errors[key]);
        } else {
          errorMessages.push(errors[key]);
        }
      });
      
      errorMessage = errorMessages.join(', ');
    } else if (error.response?.status === 400) {
      errorMessage = 'Datos inválidos';
    } else if (error.response?.status === 500) {
      errorMessage = 'Error interno del servidor';
    } else if (error.message === 'Network Error') {
      errorMessage = 'Error de conexión. Verifique su conexión a internet.';
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Función para iniciar sesión
export const loginUser = async (credentials) => {
  try {
    const response = await authApi.post('/login', {
      NumeroIdentificacion: credentials.userName,
      Contrasenna: credentials.password
    });
    
    if (response.data.resultado) {
      // Guardar datos de autenticación
      localStorage.setItem('token', response.data.AccessToken);
      localStorage.setItem('tokenExpiration', response.data.AccessTokenExpira);
      localStorage.setItem('userName', response.data.Usuario.NombreCompleto);
      localStorage.setItem('userRoles', JSON.stringify([response.data.Usuario.NombreRol]));
      localStorage.setItem('userId', response.data.Usuario.IdUsuario);
      
      return {
        token: {
          token: response.data.AccessToken,
          expiration: response.data.AccessTokenExpira
        },
        userName: response.data.Usuario.NombreCompleto,
        roles: [response.data.Usuario.NombreRol]
      };
    } else {
      throw new Error(response.data.error || 'Error al iniciar sesión');
    }
  } catch (error) {
    throw error;
  }
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRoles');
  localStorage.removeItem('userId');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const tokenExpiration = localStorage.getItem('tokenExpiration');
  
  if (!token || !tokenExpiration) {
    return false;
  }
  
  // Verificar si el token ha expirado
  const expirationDate = new Date(tokenExpiration);
  const currentDate = new Date();
  
  if (currentDate >= expirationDate) {
    logout(); // Limpiar datos si el token ha expirado
    return false;
  }
  
  return true;
};

// Función para obtener el nombre de usuario actual
export const getCurrentUser = () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  return {
    userName: localStorage.getItem('userName'),
    roles: JSON.parse(localStorage.getItem('userRoles') || '[]'),
    userId: localStorage.getItem('userId'),
    token: localStorage.getItem('token'),
    tokenExpiration: localStorage.getItem('tokenExpiration')
  };
};

// Función para verificar si el usuario tiene un rol específico
export const hasRole = (role) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.roles.includes(role);
};

// Hook personalizado para manejar el estado de autenticación
export const useAuth = () => {
  const checkAuth = () => isAuthenticated();
  const getUser = () => getCurrentUser();
  const signOut = () => {
    logout();
    window.location.href = '/login';
  };
  
  return {
    isAuthenticated: checkAuth,
    user: getUser(),
    logout: signOut,
    hasRole
  };
};

// Exportar la instancia de axios para uso en otros módulos si es necesario
export { authApi };
export default authApi;