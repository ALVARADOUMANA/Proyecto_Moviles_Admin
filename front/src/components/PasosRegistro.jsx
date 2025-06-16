import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'reactstrap';
import { User, LifeBuoy } from 'react-feather';
import FormularioCodigo from './FormularioCodigo';
import FormularioPaciente from './FormularioPaciente';
import FormularioMedico from './FormularioMedico';

const PasosRegistro = ({ tipoUsuario, onTipoUsuarioSeleccionado, onRegistroCompletado, onError, onLoading }) => {
  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');

  const handleSeleccionTipoUsuario = (tipo) => {
    onTipoUsuarioSeleccionado(tipo);
    setPaso(1);
  };

  const handleCodigoEnviado = (correo) => {
    setCorreo(correo);
    setPaso(2);
  };

  const handleCodigoVerificado = (codigo) => {
    setCodigo(codigo);
    setPaso(3);
  };

  const handleVolver = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    } else {
      onTipoUsuarioSeleccionado(null);
    }
  };

  if (!tipoUsuario) {
    return (
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h5 className="mb-4">Seleccione el tipo de usuario a registrar</h5>
          <Row>
            <Col md={6} className="mb-3">
              <Card 
                className="h-100 cursor-pointer p-4"
                onClick={() => handleSeleccionTipoUsuario('Paciente')}
                style={{ border: '2px dashed #dee2e6', transition: 'all 0.3s' }}
                hover
              >
                <User size={48} className="mb-3" style={{ color: '#3a5a40' }} />
                <h5>Paciente</h5>
                <p className="text-muted mb-0">Registrar un nuevo paciente</p>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              <Card 
                className="h-100 cursor-pointer p-4"
                onClick={() => handleSeleccionTipoUsuario('Medico')}
                style={{ border: '2px dashed #dee2e6', transition: 'all 0.3s' }}
                hover
              >
                <LifeBuoy size={48} className="mb-3" style={{ color: '#bc4749' }} />
                <h5>Médico</h5>
                <p className="text-muted mb-0">Registrar un nuevo médico</p>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  return (
    <div className="pasos-registro">
      <div className="d-flex justify-content-between mb-4">
        {[1, 2, 3].map((step) => (
          <div 
            key={step}
            className={`d-flex flex-column align-items-center ${paso >= step ? 'active' : ''}`}
            style={{ flex: 1, position: 'relative' }}
          >
            <div 
              className={`rounded-circle mb-2 ${paso >= step ? 'bg-primary text-white' : 'bg-light'}`}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                zIndex: 2
              }}
            >
              {step}
            </div>
            <small className="text-center">
              {step === 1 && 'Verificación'}
              {step === 2 && 'Código'}
              {step === 3 && 'Información'}
            </small>
            {step > 1 && (
              <div 
                className="progress-line"
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '-50%',
                  width: '100%',
                  height: '2px',
                  backgroundColor: paso >= step ? '#3a5a40' : '#e9ecef',
                  zIndex: 1
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      {paso === 1 && (
        <FormularioCodigo 
          onCodigoEnviado={handleCodigoEnviado}
          onError={onError}
          onLoading={onLoading}
        />
      )}

      {paso === 2 && (
        <FormularioCodigo 
          correo={correo}
          onCodigoVerificado={handleCodigoVerificado}
          onError={onError}
          onLoading={onLoading}
        />
      )}

      {paso === 3 && tipoUsuario === 'Paciente' && (
        <FormularioPaciente 
          correo={correo}
          codigo={codigo}
          onRegistroCompletado={onRegistroCompletado}
          onError={onError}
          onLoading={onLoading}
          onVolver={handleVolver}
        />
      )}

      {paso === 3 && tipoUsuario === 'Medico' && (
        <FormularioMedico 
          correo={correo}
          codigo={codigo}
          onRegistroCompletado={onRegistroCompletado}
          onError={onError}
          onLoading={onLoading}
          onVolver={handleVolver}
        />
      )}
    </div>
  );
};

export default PasosRegistro;