//front\src\pages\HomePage.jsx
import React from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody
} from 'reactstrap';
import { 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  Server, 
  Info,
  Briefcase,
  Monitor,
  Mail,
  FileText,
  Users,
  BookOpen
} from 'react-feather';

const HomePage = () => {
  // Color verde musgo para uso consistente
  const mossGreen = '#3A5F41';
  const lighterMossGreen = '#E8F0EA';
  
  // Estilos comunes para tarjetas
  const cardStyle = {
    borderRadius: '12px',
    border: 'none',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    height: '100%'
  };
  
  // Estilo para los badges modernos
  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: '500',
    fontSize: '0.8rem',
    backgroundColor: lighterMossGreen,
    color: mossGreen
  };
  
  // Estilo para encabezados
  const headerStyle = {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: '1.2rem'
  };

  // Efecto hover para las tarjetas
  const cardHoverEffect = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(58, 95, 65, 0.15)';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
  };

  // Estilo para iconos en círculos
  const iconContainerStyle = {
    backgroundColor: lighterMossGreen,
    padding: '10px',
    borderRadius: '12px',
    marginRight: '15px'
  };
  
  return (
    <Container className="py-5 mt-4">
      {/* Encabezado principal del curso */}
      <Row className="mb-4">
        <Col>
          <h2 style={{fontWeight: '700', color: '#2C3E50'}} className="d-flex align-items-center">
            <span style={{
              backgroundColor: lighterMossGreen,
              padding: '12px',
              borderRadius: '50%',
              marginRight: '15px',
              display: 'inline-flex'
            }}>
              <BookOpen color={mossGreen} size={28} />
            </span>
            FUNDAMENTOS DE PROGRAMACIÓN WEB
            <span style={{...badgeStyle, marginLeft: '15px', fontWeight: '600'}}>EXAMEN</span>
          </h2>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Información del Curso */}
        <Col md={6}>
          <Card className="shadow-sm" style={cardStyle} {...cardHoverEffect}>
            <CardBody>
              <div style={headerStyle} className="d-flex align-items-center">
                <div style={iconContainerStyle}>
                  <Info color={mossGreen} size={24} />
                </div>
                Detalles del Curso
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <Server size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Número de Curso</span>
                  <span style={badgeStyle}>428O</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <Server size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">NRC</span>
                  <span style={badgeStyle}>41663</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <Calendar size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Periodo</span>
                  <span style={badgeStyle}>CICLO I 2025</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <Clock size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Horas Crédito</span>
                  <span style={badgeStyle}>3</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <MapPin size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Campus</span>
                  <span style={badgeStyle}>Sede Interuniversit. Alajuela</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Información del Estudiante */}
        <Col md={6}>
          <Card className="shadow-sm" style={cardStyle} {...cardHoverEffect}>
            <CardBody>
              <div style={headerStyle} className="d-flex align-items-center">
                <div style={iconContainerStyle}>
                  <User color={mossGreen} size={24} />
                </div>
                Información del Estudiante
              </div>
              
              <div className="d-flex mb-4">
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '12px',
                  backgroundColor: lighterMossGreen,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px'
                }}>
                  <span style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: mossGreen
                  }}>PAU</span>
                </div>
                <div>
                  <h5 style={{ fontWeight: '600', marginBottom: '5px' }}>Pablo Alvarado Umaña</h5>
                  <div className="d-flex align-items-center mb-1">
                    <Mail size={14} color={mossGreen} className="me-2" />
                    <span className="text-muted small">pablo.alvarado.umana@est.una.ac.cr</span>
                  </div>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <FileText size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Carné</span>
                  <span style={badgeStyle}>305470964</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <Briefcase size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Carrera</span>
                  <span style={badgeStyle}>Ingeniería en Sistemas</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Detalles Académicos */}
        <Col md={6}>
          <Card className="shadow-sm" style={cardStyle} {...cardHoverEffect}>
            <CardBody>
              <div style={headerStyle} className="d-flex align-items-center">
                <div style={iconContainerStyle}>
                  <BookOpen color={mossGreen} size={24} />
                </div>
                Detalles Académicos
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <FileText size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Escuela</span>
                  <span style={badgeStyle}>Informática y Computación IC</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <FileText size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">División</span>
                  <span style={badgeStyle}>Facult. de Exactas y Naturales EN</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <FileText size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Modo de Calificar</span>
                  <span style={badgeStyle}>Calificación estándar</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <FileText size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Atributo</span>
                  <span style={badgeStyle}>Optativo disciplinario</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Información de Horario */}
        <Col md={6}>
          <Card className="shadow-sm" style={cardStyle} {...cardHoverEffect}>
            <CardBody>
              <div style={headerStyle} className="d-flex align-items-center">
                <div style={iconContainerStyle}>
                  <Clock color={mossGreen} size={24} />
                </div>
                Información de Horario
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <Users size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Instructor</span>
                  <span style={badgeStyle}>RAMOS PEÑARANDA, JUAN</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <Calendar size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Período Fechas</span>
                  <span style={badgeStyle}>17/02/2025 - 21/06/2025</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <Clock size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Horario</span>
                  <span style={badgeStyle}>Viernes 17:00 - 20:20</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <Monitor size={18} color={mossGreen} className="me-3" />
                <div className="d-flex justify-content-between w-100">
                  <span className="text-muted">Método Educativo</span>
                  <span style={badgeStyle}>Presencial</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;