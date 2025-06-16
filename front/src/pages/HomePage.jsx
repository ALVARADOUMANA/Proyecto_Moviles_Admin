import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  Activity, 
  Shield,
  Users,
  Monitor,
  Mail,
  FileText,
  Stethoscope,
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Heart,
  UserCheck,
  Settings,
  BarChart3
} from 'lucide-react';
import { Home } from 'react-feather';

const HomePage = () => {
  const [activeCard, setActiveCard] = useState(null);
  
  // Colores del tema médico
  const primaryColor = '#2563EB'; // Azul médico profesional
  const secondaryColor = '#10B981'; // Verde salud
  const accentColor = '#F59E0B'; // Amarillo alerta
  const dangerColor = '#EF4444'; // Rojo urgencia
  const lightBlue = '#EBF8FF';
  const lightGreen = '#F0FDF4';
  const lightYellow = '#FFFBEB';
  const lightRed = '#FEF2F2';
  
  // Estilos base
  const cardStyle = {
    borderRadius: '16px',
    border: 'none',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    height: '100%',
    overflow: 'hidden'
  };
  
  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: '25px',
    fontWeight: '600',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };
  
  const headerStyle = {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center'
  };

  const iconContainerStyle = {
    padding: '12px',
    borderRadius: '12px',
    marginRight: '12px',
    display: 'inline-flex'
  };

  // Datos simulados del dashboard
  const stats = {
    totalPacientes: 2847,
    consultasHoy: 156,
    doctoresActivos: 34,
    centrosMedicos: 8,
    citasPendientes: 89,
    emergenciasActivas: 3
  };

  const recentActivity = [
    { type: 'appointment', message: 'Nueva cita programada - Dr. García', time: '10:30 AM' },
    { type: 'emergency', message: 'Emergencia reportada - Centro Norte', time: '09:45 AM' },
    { type: 'user', message: 'Nuevo médico registrado - Dra. López', time: '09:15 AM' },
    { type: 'system', message: 'Actualización del sistema completada', time: '08:00 AM' }
  ];

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container-fluid py-4">
        {/* Header del Sistema */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div style={{
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  padding: '16px',
                  borderRadius: '16px',
                  marginRight: '20px',
                  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
                }}>
                  <Stethoscope color="white" size={32} />
                </div>
                <div>
                  <h1 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: 'white',
                    margin: 0,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    SISMED
                  </h1>
                  <p style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: '500'
                  }}>
                    Sistema de Gestión de Centros Médicos - Panel Administrativo
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span style={{
                  ...badgeStyle,
                  backgroundColor: lightGreen,
                  color: secondaryColor,
                  marginRight: '15px'
                }}>
                  <CheckCircle size={16} className="me-2" />
                  Sistema Operativo
                </span>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '12px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Settings color="white" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas Principales */}
        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-3">
            <div style={cardStyle} className="p-4 text-center">
              <div style={{
                ...iconContainerStyle,
                backgroundColor: lightBlue,
                margin: '0 auto 15px'
              }}>
                <Users color={primaryColor} size={28} />
              </div>
              <h3 style={{ color: primaryColor, fontWeight: '800', fontSize: '2.2rem' }}>
                {stats.totalPacientes.toLocaleString()}
              </h3>
              <p style={{ color: '#6B7280', margin: 0, fontWeight: '600' }}>Pacientes Registrados</p>
              <div className="mt-2">
                <span style={{ color: secondaryColor, fontSize: '0.9rem', fontWeight: '600' }}>
                  <TrendingUp size={14} className="me-1" />
                  +12% este mes
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle} className="p-4 text-center">
              <div style={{
                ...iconContainerStyle,
                backgroundColor: lightGreen,
                margin: '0 auto 15px'
              }}>
                <Activity color={secondaryColor} size={28} />
              </div>
              <h3 style={{ color: secondaryColor, fontWeight: '800', fontSize: '2.2rem' }}>
                {stats.consultasHoy}
              </h3>
              <p style={{ color: '#6B7280', margin: 0, fontWeight: '600' }}>Consultas Hoy</p>
              <div className="mt-2">
                <span style={{ color: primaryColor, fontSize: '0.9rem', fontWeight: '600' }}>
                  <Clock size={14} className="me-1" />
                  En tiempo real
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle} className="p-4 text-center">
              <div style={{
                ...iconContainerStyle,
                backgroundColor: lightYellow,
                margin: '0 auto 15px'
              }}>
                <UserCheck color={accentColor} size={28} />
              </div>
              <h3 style={{ color: accentColor, fontWeight: '800', fontSize: '2.2rem' }}>
                {stats.doctoresActivos}
              </h3>
              <p style={{ color: '#6B7280', margin: 0, fontWeight: '600' }}>Médicos Activos</p>
              <div className="mt-2">
                <span style={{ color: secondaryColor, fontSize: '0.9rem', fontWeight: '600' }}>
                  <CheckCircle size={14} className="me-1" />
                  Todos disponibles
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={cardStyle} className="p-4 text-center">
              <div style={{
                ...iconContainerStyle,
                backgroundColor: lightRed,
                margin: '0 auto 15px'
              }}>
                <AlertCircle color={dangerColor} size={28} />
              </div>
              <h3 style={{ color: dangerColor, fontWeight: '800', fontSize: '2.2rem' }}>
                {stats.emergenciasActivas}
              </h3>
              <p style={{ color: '#6B7280', margin: 0, fontWeight: '600' }}>Emergencias Activas</p>
              <div className="mt-2">
                <span style={{ color: dangerColor, fontSize: '0.9rem', fontWeight: '600' }}>
                  <Heart size={14} className="me-1" />
                  Atención prioritaria
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Información del Administrador */}
          <div className="col-lg-4">
            <div style={cardStyle} className="p-4">
              <div style={headerStyle}>
                <div style={{
                  ...iconContainerStyle,
                  backgroundColor: lightBlue
                }}>
                  <Shield color={primaryColor} size={24} />
                </div>
                Administrador del Sistema
              </div>
              
              <div className="d-flex mb-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
                }}>
                  <span style={{ 
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: 'white'
                  }}>PA</span>
                </div>
                <div>
                  <h5 style={{ fontWeight: '700', marginBottom: '8px', color: '#1F2937' }}>
                    Pablo Alvarado Umaña
                  </h5>
                  <div className="d-flex align-items-center mb-2">
                    <Mail size={16} color={primaryColor} className="me-2" />
                    <span className="text-muted small">pablo.alvarado@sismed.cr</span>
                  </div>
                  <span style={{
                    ...badgeStyle,
                    backgroundColor: lightBlue,
                    color: primaryColor
                  }}>
                    <Shield size={14} className="me-1" />
                    Super Administrador
                  </span>
                </div>
              </div>
              
              <div className="border-top pt-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-muted">ID de Usuario</span>
                  <span style={{
                    ...badgeStyle,
                    backgroundColor: lightGreen,
                    color: secondaryColor
                  }}>ADM-305470964</span>
                </div>
                
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted">Último Acceso</span>
                  <span className="fw-semibold text-dark">Hoy, 09:30 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Centros Médicos */}
          <div className="col-lg-4">
            <div style={cardStyle} className="p-4">
              <div style={headerStyle}>
                <div style={{
                  ...iconContainerStyle,
                  backgroundColor: lightGreen
                }}>
                  <Building color={secondaryColor} size={24} />
                </div>
                Centros Médicos
              </div>
              
              <div className="d-flex align-items-center justify-content-between mb-4 p-3 rounded-3" 
                   style={{ backgroundColor: lightBlue }}>
                <div>
                  <h4 style={{ color: primaryColor, fontWeight: '800', margin: 0 }}>
                    {stats.centrosMedicos}
                  </h4>
                  <p style={{ color: '#6B7280', margin: 0, fontSize: '0.9rem' }}>
                    Centros Activos
                  </p>
                </div>
                <div style={{
                  backgroundColor: primaryColor,
                  padding: '12px',
                  borderRadius: '12px'
                }}>
                  <Building color="white" size={24} />
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted">Centro Principal</span>
                  <span style={{
                    ...badgeStyle,
                    backgroundColor: lightGreen,
                    color: secondaryColor
                  }}>Operativo</span>
                </div>
                
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted">Sucursal Norte</span>
                  <span style={{
                    ...badgeStyle,
                    backgroundColor: lightGreen,
                    color: secondaryColor
                  }}>Operativo</span>
                </div>
                
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted">Sucursal Sur</span>
                  <span style={{
                    ...badgeStyle,
                    backgroundColor: lightYellow,
                    color: accentColor
                  }}>Mantenimiento</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <MapPin size={16} color={primaryColor} className="me-2" />
                <span className="text-muted small">Alajuela, Costa Rica</span>
              </div>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="col-lg-4">
            <div style={cardStyle} className="p-4">
              <div style={headerStyle}>
                <div style={{
                  ...iconContainerStyle,
                  backgroundColor: lightYellow
                }}>
                  <Activity color={accentColor} size={24} />
                </div>
                Actividad Reciente
              </div>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="d-flex align-items-start mb-3 p-2 rounded-3" 
                       style={{ backgroundColor: '#F9FAFB' }}>
                    <div style={{
                      padding: '8px',
                      borderRadius: '8px',
                      marginRight: '12px',
                      backgroundColor: activity.type === 'emergency' ? lightRed : 
                                     activity.type === 'appointment' ? lightBlue :
                                     activity.type === 'user' ? lightGreen : lightYellow
                    }}>
                      {activity.type === 'emergency' && <AlertCircle color={dangerColor} size={16} />}
                      {activity.type === 'appointment' && <Calendar color={primaryColor} size={16} />}
                      {activity.type === 'user' && <UserCheck color={secondaryColor} size={16} />}
                      {activity.type === 'system' && <Settings color={accentColor} size={16} />}
                    </div>
                    <div className="flex-grow-1">
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.9rem', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {activity.message}
                      </p>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.8rem', 
                        color: '#6B7280' 
                      }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-3">
                <button className="btn" style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 20px',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  Ver Todas las Actividades
                </button>
              </div>
            </div>
          </div>

          {/* Panel de Control Rápido */}
          <div className="col-12 mt-4">
            <div style={cardStyle} className="p-4">
              <div style={headerStyle}>
                <div style={{
                  ...iconContainerStyle,
                  backgroundColor: lightBlue
                }}>
                  <BarChart3 color={primaryColor} size={24} />
                </div>
                Panel de Control Rápido
              </div>
              
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="text-center p-3 rounded-3" style={{ backgroundColor: lightBlue }}>
                    <Calendar color={primaryColor} size={32} className="mb-2" />
                    <h6 style={{ color: primaryColor, fontWeight: '700' }}>Citas Pendientes</h6>
                    <h4 style={{ color: primaryColor, fontWeight: '800', margin: 0 }}>
                      {stats.citasPendientes}
                    </h4>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="text-center p-3 rounded-3" style={{ backgroundColor: lightGreen }}>
                    <Monitor color={secondaryColor} size={32} className="mb-2" />
                    <h6 style={{ color: secondaryColor, fontWeight: '700' }}>Sistema</h6>
                    <h4 style={{ color: secondaryColor, fontWeight: '800', margin: 0 }}>
                      99.9%
                    </h4>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="text-center p-3 rounded-3" style={{ backgroundColor: lightYellow }}>
                    <FileText color={accentColor} size={32} className="mb-2" />
                    <h6 style={{ color: accentColor, fontWeight: '700' }}>Reportes</h6>
                    <h4 style={{ color: accentColor, fontWeight: '800', margin: 0 }}>
                      24
                    </h4>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="text-center p-3 rounded-3" style={{ backgroundColor: lightRed }}>
                    <AlertCircle color={dangerColor} size={32} className="mb-2" />
                    <h6 style={{ color: dangerColor, fontWeight: '700' }}>Alertas</h6>
                    <h4 style={{ color: dangerColor, fontWeight: '800', margin: 0 }}>
                      {stats.emergenciasActivas}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;