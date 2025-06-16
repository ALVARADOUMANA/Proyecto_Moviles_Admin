import React, { useState, useEffect } from 'react';
import { 
  Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, 
  FormGroup, Label, Input, FormFeedback, Alert, Spinner, Badge, Card, CardBody
} from 'reactstrap';
import { 
  Save, X, Trash2, AlertCircle, FileText, Edit3, Clock, 
  Database, User, Calendar, Award, LifeBuoy, Droplet, PlusCircle 
} from 'react-feather';
import { showToast } from '../components/ToastNotification';

const UsuarioModal = ({ isOpen, onClose, mode, usuario, onDelete, colors }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Estilos
  const Blue = '#0000FF';
  const iconSize = 24;
  const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: '#6c757d'
  };
  const valueStyle = {
    fontSize: '1.1rem',
    fontWeight: 500
  };

  // Cargar datos del usuario cuando cambia
  useEffect(() => {
    if (usuario) {
      setFormData({
        ...usuario,
        FechaNacimiento: usuario.FechaNacimiento ? 
          new Date(usuario.FechaNacimiento).toISOString().slice(0, 10) : ''
      });
    } else {
      setFormData({});
    }
    setErrors({});
  }, [usuario, isOpen]);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Obtener badge según el tipo de usuario
  const getTipoUsuarioBadge = (rol) => {
    const config = {
      'Paciente': { color: 'info', icon: User, text: 'Paciente' },
      'Medico': { color: 'danger', icon: LifeBuoy, text: 'Médico' }
    };
    
    const item = config[rol] || { color: 'secondary', icon: User, text: rol };
    const Icon = item.icon;
    
    return (
      <Badge color={item.color} className="d-flex align-items-center" style={{ padding: '6px 12px' }}>
        <Icon size={16} className="me-1" />
        {item.text}
      </Badge>
    );
  };

  // Renderizar contenido según el modo
  const renderModalContent = () => {
    if (!usuario) return null;

    const isMedico = usuario.Rol?.Nombre === 'Medico';

    switch (mode) {
      case 'view':
        return (
          <>
            <ModalBody className="py-4">
              <Card className="border-0 shadow-sm mb-4">
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <Database size={iconSize} className="me-3" style={{color: Blue}} />
                    <div>
                      <h6 style={labelStyle}>ID {isMedico ? 'Médico' : 'Paciente'}</h6>
                      <p style={valueStyle} className="mb-0">
                        {isMedico ? usuario.IdMedico : usuario.IdPaciente}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <User size={iconSize} className="me-3" style={{color: Blue}} />
                    <div>
                      <h6 style={labelStyle}>Información Básica</h6>
                      <div className="row">
                        <div className="col-md-4">
                          <small className="text-muted d-block">Cédula</small>
                          <p style={valueStyle} className="mb-2">{usuario.NumeroIdentificacion}</p>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted d-block">Nombre</small>
                          <p style={valueStyle} className="mb-2">{usuario.Nombre}</p>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted d-block">Apellidos</small>
                          <p style={valueStyle} className="mb-2">
                            {usuario.PrimerApellido} {usuario.SegundoApellido}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <Calendar size={iconSize} className="me-3" style={{color: Blue}} />
                    <div>
                      <h6 style={labelStyle}>Fecha de Nacimiento</h6>
                      <p style={valueStyle} className="mb-0">
                        {formatDate(usuario.FechaNacimiento)} ({usuario.Genero})
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    {isMedico ? (
                      <PlusCircle  size={iconSize} className="me-3" style={{color: Blue}} />
                    ) : (
                      <Droplet size={iconSize} className="me-3" style={{color: Blue}} />
                    )}
                    <div>
                      <h6 style={labelStyle}>
                        {isMedico ? 'Información Médica' : 'Información de Salud'}
                      </h6>
                      {isMedico ? (
                        <div className="row">
                          <div className="col-md-4">
                            <small className="text-muted d-block">Licencia</small>
                            <p style={valueStyle} className="mb-2">{usuario.NumeroLicencia || 'N/A'}</p>
                          </div>
                          <div className="col-md-4">
                            <small className="text-muted d-block">Años Exp.</small>
                            <p style={valueStyle} className="mb-2">{usuario.AnnosExperiencia || 'N/A'}</p>
                          </div>
                          <div className="col-md-4">
                            <small className="text-muted d-block">Calificación</small>
                            <p style={valueStyle} className="mb-2">
                              {usuario.CalificacionPromedio ? `${usuario.CalificacionPromedio}/5` : 'N/A'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-md-4">
                            <small className="text-muted d-block">Tipo Sangre</small>
                            <p style={valueStyle} className="mb-2">{usuario.TipoSangre || 'N/A'}</p>
                          </div>
                          <div className="col-md-4">
                            <small className="text-muted d-block">Alergias</small>
                            <p style={valueStyle} className="mb-2">
                              {usuario.Alergias || 'Ninguna registrada'}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <small className="text-muted d-block">Condiciones</small>
                            <p style={valueStyle} className="mb-2">
                              {usuario.CondicionesCronicas || 'Ninguna registrada'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter className="border-0 pt-0">
              <Button 
                color="secondary" 
                onClick={onClose}
                style={{ borderRadius: '8px', padding: '10px 20px' }}
              >
                <X size={20} className="me-2" />
                Cerrar
              </Button>
            </ModalFooter>
          </>
        );

      case 'edit':
        return (
          <>
            <ModalBody className="py-4">
              <Form>
                <FormGroup className="mb-4">
                  <Label for="NumeroIdentificacion" style={labelStyle}>Cédula</Label>
                  <Input
                    type="text"
                    name="NumeroIdentificacion"
                    id="NumeroIdentificacion"
                    value={formData.NumeroIdentificacion || ''}
                    disabled
                    className="bg-light"
                  />
                </FormGroup>

                <div className="row">
                  <div className="col-md-4">
                    <FormGroup className="mb-4">
                      <Label for="Nombre" style={labelStyle}>Nombre</Label>
                      <Input
                        type="text"
                        name="Nombre"
                        id="Nombre"
                        value={formData.Nombre || ''}
                        onChange={(e) => setFormData({...formData, Nombre: e.target.value})}
                      />
                    </FormGroup>
                  </div>
                  <div className="col-md-4">
                    <FormGroup className="mb-4">
                      <Label for="PrimerApellido" style={labelStyle}>Primer Apellido</Label>
                      <Input
                        type="text"
                        name="PrimerApellido"
                        id="PrimerApellido"
                        value={formData.PrimerApellido || ''}
                        onChange={(e) => setFormData({...formData, PrimerApellido: e.target.value})}
                      />
                    </FormGroup>
                  </div>
                  <div className="col-md-4">
                    <FormGroup className="mb-4">
                      <Label for="SegundoApellido" style={labelStyle}>Segundo Apellido</Label>
                      <Input
                        type="text"
                        name="SegundoApellido"
                        id="SegundoApellido"
                        value={formData.SegundoApellido || ''}
                        onChange={(e) => setFormData({...formData, SegundoApellido: e.target.value})}
                      />
                    </FormGroup>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormGroup className="mb-4">
                      <Label for="FechaNacimiento" style={labelStyle}>Fecha de Nacimiento</Label>
                      <Input
                        type="date"
                        name="FechaNacimiento"
                        id="FechaNacimiento"
                        value={formData.FechaNacimiento || ''}
                        onChange={(e) => setFormData({...formData, FechaNacimiento: e.target.value})}
                      />
                    </FormGroup>
                  </div>
                  <div className="col-md-6">
                    <FormGroup className="mb-4">
                      <Label for="Genero" style={labelStyle}>Género</Label>
                      <Input
                        type="select"
                        name="Genero"
                        id="Genero"
                        value={formData.Genero || ''}
                        onChange={(e) => setFormData({...formData, Genero: e.target.value})}
                      >
                        <option value="">Seleccione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </Input>
                    </FormGroup>
                  </div>
                </div>

                {isMedico ? (
                  <>
                    <FormGroup className="mb-4">
                      <Label for="NumeroLicencia" style={labelStyle}>Número de Licencia</Label>
                      <Input
                        type="text"
                        name="NumeroLicencia"
                        id="NumeroLicencia"
                        value={formData.NumeroLicencia || ''}
                        onChange={(e) => setFormData({...formData, NumeroLicencia: e.target.value})}
                      />
                    </FormGroup>
                    <FormGroup className="mb-4">
                      <Label for="AnnosExperiencia" style={labelStyle}>Años de Experiencia</Label>
                      <Input
                        type="number"
                        name="AnnosExperiencia"
                        id="AnnosExperiencia"
                        value={formData.AnnosExperiencia || ''}
                        onChange={(e) => setFormData({...formData, AnnosExperiencia: e.target.value})}
                      />
                    </FormGroup>
                  </>
                ) : (
                  <>
                    <FormGroup className="mb-4">
                      <Label for="TipoSangre" style={labelStyle}>Tipo de Sangre</Label>
                      <Input
                        type="select"
                        name="TipoSangre"
                        id="TipoSangre"
                        value={formData.TipoSangre || ''}
                        onChange={(e) => setFormData({...formData, TipoSangre: e.target.value})}
                      >
                        <option value="">Seleccione</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Input>
                    </FormGroup>
                    <FormGroup className="mb-4">
                      <Label for="Alergias" style={labelStyle}>Alergias</Label>
                      <Input
                        type="textarea"
                        name="Alergias"
                        id="Alergias"
                        value={formData.Alergias || ''}
                        onChange={(e) => setFormData({...formData, Alergias: e.target.value})}
                      />
                    </FormGroup>
                  </>
                )}
              </Form>
            </ModalBody>
            <ModalFooter className="border-0 pt-0">
              <Button 
                color="secondary" 
                onClick={onClose}
                style={{ borderRadius: '8px', padding: '10px 20px' }}
              >
                <X size={20} className="me-2" />
                Cancelar
              </Button>
              <Button 
                color="primary" 
                style={{ 
                  borderRadius: '8px', 
                  padding: '10px 20px',
                  backgroundColor: colors?.primary || '#4361ee',
                  borderColor: colors?.primary || '#4361ee'
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} className="me-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </ModalFooter>
          </>
        );

      case 'delete':
        return (
          <>
            <ModalBody className="py-4">
              <Alert 
                color="danger" 
                className="d-flex align-items-center p-4"
                style={{ borderRadius: '10px' }}
              >
                <AlertCircle size={24} className="me-3" />
                <div>
                  <h5 className="alert-heading mb-2 fw-bold">Confirmar Eliminación</h5>
                  <p className="mb-0">
                    ¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.
                  </p>
                </div>
              </Alert>

              <Card className="border-0 shadow-sm mt-4">
                <CardBody>
                  <div className="d-flex align-items-center mb-3">
                    <User size={20} className="me-3 text-danger" />
                    <div>
                      <h6 style={labelStyle}>Usuario a Eliminar</h6>
                      <p style={valueStyle} className="mb-0">
                        {usuario.Nombre} {usuario.PrimerApellido} ({usuario.NumeroIdentificacion})
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    {isMedico ? (
                      <PlusCircle  size={20} className="me-3 text-danger" />
                    ) : (
                      <Droplet size={20} className="me-3 text-danger" />
                    )}
                    <div>
                      <h6 style={labelStyle}>Tipo de Usuario</h6>
                      <div style={valueStyle} className="mb-0">
                        {getTipoUsuarioBadge(usuario.Rol?.Nombre)}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter className="border-0 pt-0">
              <Button 
                color="secondary" 
                onClick={onClose}
                style={{ borderRadius: '8px', padding: '10px 20px' }}
              >
                <X size={20} className="me-2" />
                Cancelar
              </Button>
              <Button 
                color="danger" 
                onClick={() => onDelete(usuario)}
                style={{ 
                  borderRadius: '8px', 
                  padding: '10px 20px',
                  backgroundColor: colors?.danger || '#ef4444',
                  borderColor: colors?.danger || '#ef4444'
                }}
              >
                <Trash2 size={20} className="me-2" />
                Eliminar Usuario
              </Button>
            </ModalFooter>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      toggle={onClose} 
      size="lg"
      centered
      className="modal-modern"
    >
      <ModalHeader 
        toggle={onClose} 
        style={{
          backgroundColor: Blue,
          color: 'white',
          borderBottom: 'none'
        }}
      >
        <div className="d-flex align-items-center">
          {mode === 'view' && <FileText size={20} className="me-2" />}
          {mode === 'edit' && <Edit3 size={20} className="me-2" />}
          {mode === 'delete' && <Trash2 size={20} className="me-2" />}
          <span>
            {mode === 'view' && 'Detalles de Usuario'}
            {mode === 'edit' && 'Editar Usuario'}
            {mode === 'delete' && 'Eliminar Usuario'}
          </span>
        </div>
      </ModalHeader>
      {renderModalContent()}
    </Modal>
  );
};

export default UsuarioModal;