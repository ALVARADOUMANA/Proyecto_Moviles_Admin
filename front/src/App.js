// src/App.js 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MyNavbar from './components/Navbar';
import BreadcrumbContent from './components/BreadcrumbContent';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import { Container } from 'reactstrap';
import { isAuthenticated } from './hooks/useAuth';
import TablaUsuarios from './pages/TablaUsuarios';
import CrearUsuario from './pages/CrearUsuario';


// Componente interno que maneja las rutas y tiene acceso a useLocation
const AppContent = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [authenticated, setAuthenticated] = useState(null);
  const location = useLocation();

  // Verificar autenticación solo al montar el componente
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = isAuthenticated();
        setAuthenticated(authStatus);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthenticated(false);
      }
    };

    // Solo verificar autenticación una vez al cargar la app
    if (authenticated === null) {
      checkAuth();
    }
  }, []); // Eliminado location.pathname de las dependencias

  // Función para comunicar el estado del sidebar
  const handleSidebarToggle = (isExpanded) => {
    setSidebarExpanded(isExpanded);
  };

  // Componente para rutas públicas (login)
  const PublicRoute = ({ children }) => {
    if (authenticated === null) {
      return <LoadingScreen />;
    }

    if (authenticated) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  // Layout para páginas autenticadas
  const AuthenticatedLayout = ({ children }) => (
    <div className="d-flex">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className="content-wrapper" style={{
        marginLeft: sidebarExpanded ? '250px' : '80px',
        width: `calc(100% - ${sidebarExpanded ? '250px' : '80px'})`,
        transition: 'margin-left 0.3s, width 0.3s',
        minHeight: '100vh'
      }}>
        <MyNavbar />
        <Container fluid className="p-4">
          <BreadcrumbContent />
          {children}
        </Container>
      </div>
    </div>
  );

  // Componente de loading mejorado
  const LoadingScreen = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div>Verificando autenticación...</div>
      </div>
    </div>
  );

  // Componente wrapper para rutas protegidas que incluye el layout
  const ProtectedRouteWithLayout = ({ children }) => (
    <ProtectedRoute>
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
    </ProtectedRoute>
  );

  // Mostrar loading mientras se verifica la autenticación
  if (authenticated === null) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRouteWithLayout>
            <HomePage />
          </ProtectedRouteWithLayout>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRouteWithLayout>
            <TablaUsuarios />
          </ProtectedRouteWithLayout>
        }
      />

      <Route
        path="/usuarios/crear"
        element={
          <ProtectedRouteWithLayout>
            <CrearUsuario />
          </ProtectedRouteWithLayout>
        }
      />

      {/* Ruta para editar culture
      <Route
        path="/editar_culture/:id"
        element={
          <ProtectedRouteWithLayout>
            <NuevoDepartment />
          </ProtectedRouteWithLayout>
        }
      /> */}

      {/* Ruta por defecto */}
      <Route
        path="*"
        element={
          authenticated ?
            <Navigate to="/" replace /> :
            <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;