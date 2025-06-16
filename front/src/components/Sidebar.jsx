// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { 
  Nav, 
  NavItem, 
  NavLink, 
  Button,
} from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Menu,
  FileText,
  BookOpen,
  ChevronLeft,
  LogOut,
  User
} from 'react-feather';
import { logout } from '../hooks/useAuth';

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (onToggle) {
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  
  const navItems = [
    { path: '/', icon: <Home size={18} />, label: 'Home' },
    { path: '/usuarios/crear', icon: <User size={18} />, label: 'Crear Usuario' },
    { path: '/usuarios', icon: <FileText size={18} />, label: 'Tabla Usuarios' },
    { path: '/especialidades', icon: <BookOpen size={18} />, label: 'Tabla Especialidades' },
    { path: '/especialidades/crear', icon: <FileText size={18} />, label: 'Crear Especialidades' }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`} 
         style={{ 
           backgroundColor: '#1E3A8A',  // azul oscuro
           height: '100vh',
           position: 'fixed',
           left: 0,
           top: 0,
           width: isOpen ? '250px' : '80px',
           transition: 'width 0.3s',
           zIndex: 1030,
           boxShadow: '2px 0 5px rgba(0,0,0,0.2)'
         }}>
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center px-3 py-3 text-white">
        {isOpen ? (
          <Link 
            to="/"
            className="text-decoration-none text-white d-flex align-items-center"
          >
            <img 
              src="/UNA.svg"
              alt="Logo" 
              style={{ height: '30px', marginRight: '10px' }} 
            />
            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>SISMED</span>
          </Link>
        ) : (
          <Link 
            to="/"
            className="text-decoration-none text-white mx-auto"
          >
            <img 
              src="/UNA.svg"
              alt="Logo" 
              style={{ height: '30px' }} 
            />
          </Link>
        )}
        <Button 
          color="link" 
          className="text-white p-0 border-0" 
          onClick={toggleSidebar}
          style={{ 
            backgroundColor: 'transparent',
            marginRight: isOpen ? '0' : '8px',
            width: '24px',
            height: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      <hr className="bg-white opacity-25 my-2" />
      
      {/* Navigation */}
      <Nav vertical className="pt-2">
        {navItems.map((item) => (
          <NavItem key={item.path}>
            <Link
              to={item.path}
              className={`nav-link text-white ${location.pathname === item.path ? 'active' : ''}`}
              style={{ 
                backgroundColor: location.pathname === item.path ? 'rgba(147,197,253,0.3)' : 'transparent', // azul claro translúcido
                borderLeft: location.pathname === item.path ? '4px solid #93C5FD' : 'none', // azul claro
                paddingLeft: location.pathname === item.path ? '10px' : '16px',
                paddingRight: isOpen ? '24px' : '16px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isOpen ? 'flex-start' : 'center',
                textDecoration: 'none',
                paddingTop: '12px',
                paddingBottom: '12px'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'rgba(147,197,253,0.1)'; // azul claro más tenue
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div className={`d-flex align-items-center ${!isOpen ? 'justify-content-center w-100' : ''}`}>
                <span className={isOpen ? 'me-3' : ''}>{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </div>
            </Link>
          </NavItem>
        ))}
      </Nav>
      
      {/* Logout Button */}
      <div className="position-absolute" style={{ bottom: isOpen ? '60px' : '20px', left: '0', right: '0' }}>
        <Nav vertical>
          <NavItem>
            <div
              className="nav-link text-white"
              style={{ 
                paddingLeft: '16px',
                paddingRight: isOpen ? '24px' : '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isOpen ? 'flex-start' : 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                paddingTop: '12px',
                paddingBottom: '12px'
              }}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(147,197,253,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className={`d-flex align-items-center ${!isOpen ? 'justify-content-center w-100' : ''}`}>
                <span className={isOpen ? 'me-3' : ''}><LogOut size={18} /></span>
                {isOpen && <span>Cerrar Sesión</span>}
              </div>
            </div>
          </NavItem>
        </Nav>
      </div>
      
      {/* Footer */}
      {isOpen && (
        <div className="position-absolute bottom-0 start-0 w-100 text-center text-white-50 py-3 small">
          <hr className="bg-white opacity-25" />
          SISMED © 2025
        </div>
      )}
    </div>
  );
};

export default Sidebar;
