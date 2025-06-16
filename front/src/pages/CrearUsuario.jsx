import React, { useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Alert, Spinner } from 'reactstrap';
import { Home, UserPlus, ArrowLeft, AlertCircle } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { ToastNotification } from '../components/ToastNotification';
import PasosRegistro from '../components/PasosRegistro';

const COLORS = {
  primary: '#3a5a40',
  secondary: '#588157',
  success: '#386641',
  danger: '#bc4749',
  warning: '#dda15e',
  light: '#f4f4f4',
  dark: '#283618',
};

const CrearUsuario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  const handleTipoUsuarioSeleccionado = (tipo) => {
    setTipoUsuario(tipo);
  };

  const handleRegistroCompletado = () => {
    // Redirigir a la tabla de usuarios después de 1.5 segundos
    setTimeout(() => {
      navigate('/tabla_usuarios');
    }, 1500);
  };

  return (
    <Container fluid className="py-4">
      <ToastNotification
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme="colored"
      />

      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center">
            <Home 
              size={24} 
              className="me-2 cursor-pointer" 
              style={{ color: COLORS.primary }}
              onClick={() => navigate('/')}
            />
            <h1 className="mb-0 fs-2 fw-bold" style={{ color: COLORS.dark }}>
              {tipoUsuario ? `Registro de ${tipoUsuario === 'Paciente' ? 'Paciente' : 'Médico'}` : 'Nuevo Usuario'}
            </h1>
          </div>
        </Col>
        {tipoUsuario && (
          <Col xs="auto">
            <button 
              className="btn btn-link text-decoration-none"
              onClick={() => setTipoUsuario(null)}
              style={{ color: COLORS.primary }}
            >
              <ArrowLeft size={18} className="me-1" />
              Volver a selección
            </button>
          </Col>
        )}
      </Row>

      {/* Card container */}
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white border-bottom" style={{ borderColor: '#e6e6e6' }}>
          <h5 className="mb-0" style={{ color: COLORS.dark }}>
            {tipoUsuario ? 'Complete el formulario' : 'Seleccione el tipo de usuario'}
          </h5>
        </CardHeader>
        <CardBody>
          {error && (
            <Alert color="danger" className="mb-4">
              <AlertCircle size={18} className="me-2" />
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">
              <Spinner color="primary" style={{ color: COLORS.primary }} />
              <p className="mt-2">Procesando solicitud...</p>
            </div>
          ) : (
            <PasosRegistro
              tipoUsuario={tipoUsuario}
              onTipoUsuarioSeleccionado={handleTipoUsuarioSeleccionado}
              onRegistroCompletado={handleRegistroCompletado}
              onError={setError}
              onLoading={setLoading}
            />
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default CrearUsuario;