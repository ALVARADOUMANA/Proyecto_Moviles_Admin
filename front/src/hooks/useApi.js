import axios from 'axios';

// URL base para la API
const API_URL = 'https://localhost:44388';


// Configuración base de axios
const baseConfig = {
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

// Instancia de axios
const api = axios.create(baseConfig);

// Interceptor para agregar el token a las peticiones si existe
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRoles');
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
    } else if (error.response?.status === 403) {
      errorMessage = 'No tienes permisos para realizar esta acción';
    } else if (error.response?.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.response?.status === 500) {
      errorMessage = 'Error interno del servidor';
    } else if (error.message === 'Network Error') {
      errorMessage = 'Error de conexión. Verifique su conexión a internet.';
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// APIs para Department
export const obtenerDepartments = () => api.get('/api/Department');
export const obtenerDepartmentPorId = (id) => api.get(`/api/Department/${id}`);
export const crearDepartment = (data) => api.post('/api/Department', data);
export const actualizarDepartment = (data) => api.put('/api/Department', data);
export const eliminarDepartment = (id) => api.delete(`/api/Department/${id}`);

// APIs para Person
export const obtenerPersons = () => api.get('/api/Person');
export const obtenerPersonPorId = (id) => api.get(`/api/Person/${id}`);
export const crearPerson = (data) => api.post('/api/Person', data);
export const actualizarPerson = (data) => api.put('/api/Person', data);
export const eliminarPerson = (id) => api.delete(`/api/Person/${id}`);

// Función helper para verificar si el usuario está autenticado antes de hacer peticiones
export const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  const tokenExpiration = localStorage.getItem('tokenExpiration');
  
  if (!token || !tokenExpiration) {
    return false;
  }
  
  // Verificar si el token ha expirado
  const expirationDate = new Date(tokenExpiration);
  const currentDate = new Date();
  
  if (currentDate >= expirationDate) {
    // Limpiar datos si el token ha expirado
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRoles');
    return false;
  }
  
  return true;
};

// Wrapper functions con verificación de autenticación (opcional)
export const obtenerDepartmentsSafe = async () => {
  if (!isUserAuthenticated()) {
    throw new Error('Usuario no autenticado');
  }
  return obtenerDepartments();
};

export const obtenerDepartmentPorIdSafe = async (id) => {
  if (!isUserAuthenticated()) {
    throw new Error('Usuario no autenticado');
  }
  return obtenerDepartmentPorId(id);
};

export const crearDepartmentSafe = async (data) => {
  if (!isUserAuthenticated()) {
    throw new Error('Usuario no autenticado');
  }
  return crearDepartment(data);
};

export const actualizarDepartmentSafe = async (data) => {
  if (!isUserAuthenticated()) {
    throw new Error('Usuario no autenticado');
  }
  return actualizarDepartment(data);
};

export const eliminarDepartmentSafe = async (id) => {
  if (!isUserAuthenticated()) {
    throw new Error('Usuario no autenticado');
  }
  return eliminarDepartment(id);
};

// Exportar la instancia para su uso en otros módulos
export { api };
export default api;