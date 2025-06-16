//front\src\components\Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Navbar, 
  Nav, 
  NavItem
} from 'reactstrap';
import { 
  User,
  Clock,
  Mail,
  LogOut,
  Settings,
  Shield
} from 'react-feather';
import { useAuth, getCurrentUser } from '../hooks/useAuth';

const MyNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Actualizar información del usuario - CORREGIDO
  useEffect(() => {
    const updateUserData = () => {
      try {
        if (isAuthenticated()) {
          const userData = getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        setUser(null);
      }
    };

    updateUserData();
  }, []); // Sin dependencias para evitar el bucle infinito

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Actualizar la hora y fecha
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-ES'));
      
      // Formato de fecha: día de la semana, día de mes de año
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('es-ES', options));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Obtener iniciales del usuario
  const getUserInitials = (userName) => {
    if (!userName) return 'U';
    const names = userName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  // Si no está autenticado, no mostrar el navbar
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <Navbar 
      dark
      expand="md" 
      className="py-2 px-4" 
      style={{ 
        backgroundColor: '#1E3A23',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
      }}
    >
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Parte izquierda - Reloj y Fecha */}
        <div className="d-flex flex-column align-items-start text-white">
          <div className="d-flex align-items-center">
            <Clock size={18} className="me-2" />
            <span className="fw-bold" style={{ fontSize: '1.1rem' }}>{currentTime}</span>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9, textTransform: 'capitalize' }}>
            {currentDate}
          </div>
        </div>

        {/* Parte central vacía para mantener el equilibrio */}
        <div className="d-none d-lg-flex"></div>

        {/* Parte derecha - Perfil de usuario */}
        <Nav className="ml-auto" navbar>
          {/* Perfil de usuario - Implementación personalizada del dropdown */}
          <NavItem className="ms-2 d-flex align-items-center">
            <div ref={dropdownRef} className="position-relative">
              {/* Toggle button */}
              <div 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle bg-white text-dark d-flex justify-content-center align-items-center me-2"
                    style={{ 
                      width: '40px', 
                      height: '40px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  >
                    <span className="fw-bold">
                      {user ? getUserInitials(user.userName) : 'U'}
                    </span>
                  </div>
                  <div className="d-none d-md-block text-white">
                    <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
                      {user ? user.userName : 'Usuario'}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      {user && user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'Usuario'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dropdown menu - implementación personalizada */}
              {userDropdownOpen && (
                <div 
                  className="position-absolute bg-white rounded shadow"
                  style={{ 
                    minWidth: '280px', 
                    padding: '0.5rem 0',
                    marginTop: '0.5rem',
                    zIndex: 1050,
                    top: '100%',
                    right: 0,
                    position: 'fixed',
                    transform: 'translateX(10%)'
                  }}
                >
                  {/* Header del dropdown */}
                  <div className="px-3 py-2 mb-2 border-bottom">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle bg-light d-flex justify-content-center align-items-center me-3"
                        style={{ width: '48px', height: '48px' }}>
                        <span className="fw-bold text-dark">
                          {user ? getUserInitials(user.userName) : 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="fw-bold">{user ? user.userName : 'Usuario'}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                          {user && user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'Sin roles asignados'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del token */}
                  {user && user.tokenExpiration && (
                    <div className="px-3 py-2 mb-2">
                      <div className="d-flex align-items-center text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                        <Shield size={14} className="me-2" />
                        <span>Token expira: {new Date(user.tokenExpiration).toLocaleString('es-ES')}</span>
                      </div>
                    </div>
                  )}

                  {/* Opciones del menú */}
                  <div className="border-top pt-2">
                    <button
                      className="btn btn-link text-start w-100 px-3 py-2 text-decoration-none"
                      style={{ 
                        color: '#6c757d',
                        borderRadius: '0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        setUserDropdownOpen(false);
                        // Aquí puedes agregar navegación a perfil si tienes esa página
                      }}
                    >
                      <Settings size={16} className="me-2" />
                      Configuración
                    </button>
                    
                    <button
                      className="btn btn-link text-start w-100 px-3 py-2 text-decoration-none text-danger"
                      style={{ 
                        borderRadius: '0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut size={16} className="me-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </NavItem>
        </Nav>
      </div>
    </Navbar>
  );
};

export default MyNavbar;