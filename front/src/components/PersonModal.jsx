import React, { useState, useEffect } from 'react';
import { 
  Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, 
  FormGroup, Label, Input, FormFeedback, Alert, Spinner, Badge, Card, CardBody
} from 'reactstrap';
import { 
  Save, X, Trash2, AlertCircle, FileText, Edit3, Clock, Database, User, Calendar, Award , BookOpen
} from 'react-feather';
import { actualizarPerson } from '../hooks/useApi';
import { showToast } from '../components/ToastNotification';

const PersonModal = ({ isOpen, onClose, mode, person, onDelete, colors }) => {
  const [formData, setFormData] = useState({ 
    personId: '', 
    lastName: '', 
    firstName: '', 
    hireDate: '',
    enrollmentDate: '',
    discriminator: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Estilos personalizados para modernizar
  const mossGreen = '#556B2F'; // Color verde musgo para los iconos
  const iconSize = 24; // Incrementado para mayor visibilidad
  const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: '#6c757d'
  };
  const valueStyle = {
    fontSize: '1.2rem', // Texto más grande
    fontWeight: 500
  };
  const headerStyle = {
    backgroundColor: mossGreen,
    color: 'white',
    borderBottom: 'none'
  };
  const buttonStyle = {
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: 500,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '120px'
  };

  useEffect(() => {
    if (person) {
      setFormData({
        personId: person.personId || '',
        lastName: person.lastName || '',
        firstName: person.firstName || '',
        hireDate: person.hireDate ? new Date(person.hireDate).toISOString().slice(0, 16) : '',
        enrollmentDate: person.enrollmentDate ? new Date(person.enrollmentDate).toISOString().slice(0, 16) : '',
        discriminator: person.discriminator || ''
      });
    } else {
      setFormData({ 
        personId: '', 
        lastName: '', 
        firstName: '', 
        hireDate: '', 
        enrollmentDate: '',
        discriminator: ''
      });
    }
    setErrors({});
  }, [person, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.lastName || formData.lastName.trim() === '') {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.firstName || formData.firstName.trim() === '') {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.discriminator) {
      newErrors.discriminator = 'El tipo de persona es requerido';
    }

    // Validar fecha según el discriminator
    if (formData.discriminator === 'Instructor' && !formData.hireDate) {
      newErrors.hireDate = 'La fecha de contratación es requerida para instructores';
    }

    if (formData.discriminator === 'Student' && !formData.enrollmentDate) {
      newErrors.enrollmentDate = 'La fecha de inscripción es requerida para estudiantes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Preparar datos según el discriminator
      const dataToSend = {
        personId: parseInt(formData.personId),
        lastName: formData.lastName.trim(),
        firstName: formData.firstName.trim(),
        discriminator: formData.discriminator,
        hireDate: formData.discriminator === 'Instructor' && formData.hireDate ? 
          new Date(formData.hireDate).toISOString() : null,
        enrollmentDate: formData.discriminator === 'Student' && formData.enrollmentDate ? 
          new Date(formData.enrollmentDate).toISOString() : null
      };

      await actualizarPerson(dataToSend);
      showToast.success('Persona actualizada exitosamente');
      onClose();
      // Refrescar la lista después de la actualización
      window.location.reload();
    } catch (err) {
      showToast.error(`Error: ${err.message || 'Ha ocurrido un error al actualizar'}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear la fecha y hora completa
  const formatDateTime = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Función para obtener el badge del discriminator
  const getDiscriminatorBadge = (discriminator) => {
    const config = {
      'Instructor': { color: 'primary', icon: Award , text: 'Instructor' },
      'Student': { color: 'success', icon: BookOpen, text: 'Estudiante' }
    };
    
    const item = config[discriminator] || { color: 'secondary', icon: User, text: discriminator };
    const IconComponent = item.icon;
    
    return (
      <Badge color={item.color} className="d-flex align-items-center" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
        <IconComponent size={16} className="me-1" />
        {item.text}
      </Badge>
    );
  };

  const renderModalContent = () => {
    switch (mode) {
      case 'view':
        return (
          <>
            <ModalBody className="py-4">
              <Card className="border-0 shadow-sm mb-4">
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <Database size={iconSize} className="me-3" style={{color: mossGreen}} />
                    <div>
                      <h6 style={labelStyle}>ID de Persona</h6>
                      <p style={valueStyle} className="mb-0">{formData.personId}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <User size={iconSize} className="me-3" style={{color: mossGreen}} />
                    <div>
                      <h6 style={labelStyle}>Nombre Completo</h6>
                      <p style={valueStyle} className="mb-0">{formData.firstName} {formData.lastName}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-4">
                    <User size={iconSize} className="me-3" style={{color: mossGreen}} />
                    <div>
                      <h6 style={labelStyle}>Tipo de Persona</h6>
                      <div style={valueStyle} className="mb-0">
                        {getDiscriminatorBadge(formData.discriminator)}
                      </div>
                    </div>
                  </div>

                  {formData.discriminator === 'Instructor' && formData.hireDate && (
                    <div className="d-flex align-items-center mb-4">
                      <Calendar size={iconSize} className="me-3" style={{color: mossGreen}} />
                      <div>
                        <h6 style={labelStyle}>Fecha de Contratación</h6>
                        <p style={valueStyle} className="mb-0">
                          {formatDateTime(formData.hireDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.discriminator === 'Student' && formData.enrollmentDate && (
                    <div className="d-flex align-items-center mb-4">
                      <Calendar size={iconSize} className="me-3" style={{color: mossGreen}} />
                      <div>
                        <h6 style={labelStyle}>Fecha de Inscripción</h6>
                        <p style={valueStyle} className="mb-0">
                          {formatDateTime(formData.enrollmentDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {person && person.modifiedDate && (
                    <div className="d-flex align-items-center">
                      <Clock size={iconSize} className="me-3" style={{color: mossGreen}} />
                      <div>
                        <h6 style={labelStyle}>Última Modificación</h6>
                        <p style={valueStyle} className="mb-0">
                          {new Date(person.modifiedDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter className="border-0 pt-0">
              <Button 
                color="secondary" 
                onClick={onClose} 
                style={{...buttonStyle, backgroundColor: '#f8f9fa', color: '#333'}}
              >
                <X size={iconSize - 4} className="me-2" />
                <span>Cerrar</span>
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
                  <div className="d-flex align-items-center mb-2">
                    <Database size={20} className="me-2" style={{color: mossGreen}} />
                    <Label for="personId" style={labelStyle}>ID de Persona</Label>
                  </div>
                  <Input
                    type="text"
                    name="personId"
                    id="personId"
                    value={formData.personId}
                    disabled
                    className="bg-light form-control-lg"
                    style={{borderRadius: '8px'}}
                  />
                </FormGroup>

                <FormGroup className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <User size={20} className="me-2" style={{color: mossGreen}} />
                    <Label for="firstName" style={labelStyle}>Nombre</Label>
                  </div>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Ingrese el nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                    invalid={!!errors.firstName}
                    className="form-control-lg"
                    style={{borderRadius: '8px'}}
                  />
                  <FormFeedback>{errors.firstName}</FormFeedback>
                </FormGroup>

                <FormGroup className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <User size={20} className="me-2" style={{color: mossGreen}} />
                    <Label for="lastName" style={labelStyle}>Apellido</Label>
                  </div>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Ingrese el apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                    invalid={!!errors.lastName}
                    className="form-control-lg"
                    style={{borderRadius: '8px'}}
                  />
                  <FormFeedback>{errors.lastName}</FormFeedback>
                </FormGroup>

                <FormGroup className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <User size={20} className="me-2" style={{color: mossGreen}} />
                    <Label for="discriminator" style={labelStyle}>Tipo de Persona</Label>
                  </div>
                  <Input
                    type="select"
                    name="discriminator"
                    id="discriminator"
                    value={formData.discriminator}
                    onChange={handleChange}
                    invalid={!!errors.discriminator}
                    className="form-control-lg"
                    style={{borderRadius: '8px'}}
                  >
                    <option value="">Seleccione el tipo de persona</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Student">Estudiante</option>
                  </Input>
                  <FormFeedback>{errors.discriminator}</FormFeedback>
                </FormGroup>

                {formData.discriminator === 'Instructor' && (
                  <FormGroup className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <Calendar size={20} className="me-2" style={{color: mossGreen}} />
                      <Label for="hireDate" style={labelStyle}>Fecha de Contratación</Label>
                    </div>
                    <Input
                      type="datetime-local"
                      name="hireDate"
                      id="hireDate"
                      value={formData.hireDate}
                      onChange={handleChange}
                      invalid={!!errors.hireDate}
                      className="form-control-lg"
                      style={{borderRadius: '8px'}}
                    />
                    <FormFeedback>{errors.hireDate}</FormFeedback>
                  </FormGroup>
                )}

                {formData.discriminator === 'Student' && (
                  <FormGroup>
                    <div className="d-flex align-items-center mb-2">
                      <Calendar size={20} className="me-2" style={{color: mossGreen}} />
                      <Label for="enrollmentDate" style={labelStyle}>Fecha de Inscripción</Label>
                    </div>
                    <Input
                      type="datetime-local"
                      name="enrollmentDate"
                      id="enrollmentDate"
                      value={formData.enrollmentDate}
                      onChange={handleChange}
                      invalid={!!errors.enrollmentDate}
                      className="form-control-lg"
                      style={{borderRadius: '8px'}}
                    />
                    <FormFeedback>{errors.enrollmentDate}</FormFeedback>
                  </FormGroup>
                )}
              </Form>
            </ModalBody>
            <ModalFooter className="border-0 pt-0">
              <Button 
                color="secondary" 
                onClick={onClose} 
                disabled={loading}
                style={{...buttonStyle, backgroundColor: '#f8f9fa', color: '#333'}}
              >
                <X size={iconSize - 4} className="me-2" />
                <span>Cancelar</span>
              </Button>
              <Button 
                color="primary" 
                onClick={handleUpdate}
                disabled={loading}
                style={{
                  ...buttonStyle, 
                  backgroundColor: colors?.primary || '#4361ee', 
                  borderColor: colors?.primary || '#4361ee'
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={iconSize - 4} className="me-2" />
                    <span>Guardar</span>
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
                className="d-flex align-items-start p-4"
                style={{borderRadius: '10px'}}
              >
                <AlertCircle size={iconSize} className="me-3" />
                <div>
                  <h5 className="alert-heading mb-2 fw-bold">Confirmar eliminación</h5>
                  <p className="mb-0 fs-5">
                    ¿Está seguro que desea eliminar esta persona? Esta acción no se puede deshacer.
                  </p>
                </div>
              </Alert>

              <Card className="border-0 shadow-sm mt-4">
                <CardBody>
                  <div className="d-flex align-items-center mb-3">
                    <Database size={iconSize - 2} className="me-3 text-danger" />
                    <div>
                      <h6 style={labelStyle}>ID de Persona</h6>
                      <p style={valueStyle} className="mb-0">{formData.personId}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <User size={iconSize - 2} className="me-3 text-danger" />
                    <div>
                      <h6 style={labelStyle}>Nombre Completo</h6>
                      <p style={valueStyle} className="mb-0">{formData.firstName} {formData.lastName}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <User size={iconSize - 2} className="me-3 text-danger" />
                    <div>
                      <h6 style={labelStyle}>Tipo</h6>
                      <div style={valueStyle} className="mb-0">
                        {getDiscriminatorBadge(formData.discriminator)}
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
                style={{...buttonStyle, backgroundColor: '#f8f9fa', color: '#333'}}
              >
                <X size={iconSize - 4} className="me-2" />
                <span>Cancelar</span>
              </Button>
              <Button 
                color="danger" 
                onClick={onDelete}
                style={{
                  ...buttonStyle, 
                  backgroundColor: colors?.danger || '#ef4444', 
                  borderColor: colors?.danger || '#ef4444'
                }}
              >
                <Trash2 size={iconSize - 4} className="me-2" />
                <span>Eliminar</span>
              </Button>
            </ModalFooter>
          </>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'view':
        return (
          <div className="d-flex align-items-center">
            <FileText size={iconSize} className="me-2" />
            <span>Detalles de Persona</span>
          </div>
        );
      case 'edit':
        return (
          <div className="d-flex align-items-center">
            <Edit3 size={iconSize} className="me-2" />
            <span>Editar Persona</span>
          </div>
        );
      case 'delete':
        return (
          <div className="d-flex align-items-center">
            <Trash2 size={iconSize} className="me-2" />
            <span>Eliminar Persona</span>
          </div>
        );
      default:
        return 'Persona';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      toggle={onClose} 
      size="lg" // Más grande que el original 
      contentClassName="border-0 shadow"
      modalClassName="modal-modern"
    >
      <ModalHeader 
        toggle={onClose} 
        style={{
          ...headerStyle,
          paddingTop: '16px',
          paddingBottom: '16px'
        }}
      >
        {getModalTitle()}
      </ModalHeader>
      {renderModalContent()}
    </Modal>
  );
};

export default PersonModal;