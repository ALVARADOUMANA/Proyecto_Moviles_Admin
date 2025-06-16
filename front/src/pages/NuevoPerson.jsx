import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Save, X, User, UserCheck, Award  } from 'react-feather';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Button,
  Form, FormGroup, Label, Input, FormFeedback, Spinner, Alert
} from 'reactstrap';
import { ToastNotification } from '../components/ToastNotification';
import usePersonForm from '../hooks/usePersonForm';
import { obtenerPersonPorId } from '../hooks/useApi';

// Definimos los colores personalizados
const COLORS = {
  primary: '#3a5a40',
  secondary: '#588157',
  success: '#386641',
  danger: '#bc4749',
  warning: '#dda15e',
  light: '#f4f4f4',
  dark: '#283618',
  white: '#ffffff',
  gray: '#6c757d'
};

const NuevoPerson = () => {
  const { id } = useParams(); // Para editar una person existente
  const isEditing = !!id;
  const navigate = useNavigate();

  // Callback de éxito que será ejecutado después de guardar o actualizar
  const handleSuccess = useCallback(() => {
    // Redireccionar a la tabla después de guardar exitosamente
    setTimeout(() => {
      navigate('/tabla_persons');
    }, 1500); // Retraso de 1.5 segundos para que el usuario vea el toast de éxito
  }, [navigate]);

  const {
    formData,
    loading,
    errors,
    setFormData,
    handleChange,
    createPerson,
    updatePerson,
    resetForm
  } = usePersonForm(null, handleSuccess);

  useEffect(() => {
    const fetchPerson = async () => {
      if (isEditing) {
        try {
          const response = await obtenerPersonPorId(id);
          // Formatear las fechas para los inputs datetime-local
          console.log('Response data:', response.data);
          const personData = {
            ...response.data,
            hireDate: response.data.hireDate ? new Date(response.data.hireDate).toISOString().slice(0, 16) : '',
            enrollmentDate: response.data.enrollmentDate ? new Date(response.data.enrollmentDate).toISOString().slice(0, 16) : ''
          };
          setFormData(personData);
        } catch (error) {
          // Error handling would be managed by the toast notification
        }
      }
    };

    fetchPerson();
  }, [id, isEditing, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;

    if (isEditing) {
      success = await updatePerson();
    } else {
      success = await createPerson();
    }

    // La redirección ahora está controlada por handleSuccess que se ejecuta cuando es exitoso
  };

  const handleReset = () => {
    resetForm();
  };

  const getDiscriminatorIcon = (discriminator) => {
    switch (discriminator) {
      case 'Instructor':
        return <UserCheck size={18} className="me-1" style={{ color: COLORS.primary }} />;
      case 'Student':
        return <Award  size={18} className="me-1" style={{ color: COLORS.secondary }} />;
      default:
        return <User size={18} className="me-1" style={{ color: COLORS.gray }} />;
    }
  };

  const getDateLabel = () => {
    if (formData.discriminator === 'Instructor') {
      return 'Fecha de Contratación';
    } else if (formData.discriminator === 'Student') {
      return 'Fecha de Inscripción';
    }
    return 'Fecha';
  };

  const getDateFieldName = () => {
    if (formData.discriminator === 'Instructor') {
      return 'hireDate';
    } else if (formData.discriminator === 'Student') {
      return 'enrollmentDate';
    }
    return '';
  };

  const getDateValue = () => {
    if (formData.discriminator === 'Instructor') {
      return formData.hireDate || '';
    } else if (formData.discriminator === 'Student') {
      return formData.enrollmentDate || '';
    }
    return '';
  };

  const getDateError = () => {
    if (formData.discriminator === 'Instructor') {
      return errors.hireDate;
    } else if (formData.discriminator === 'Student') {
      return errors.enrollmentDate;
    }
    return '';
  };

  return (
    <Container fluid className="py-4">
      {/* Componente de Toast personalizado */}
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
            <Home size={24} className="me-2" style={{ color: COLORS.primary }} />
            <h1 className="mb-0 fs-2 fw-bold" style={{ color: COLORS.dark }}>
              {isEditing ? 'Editar Person' : 'Nueva Person'}
            </h1>
          </div>
        </Col>
      </Row>

      {/* Card container */}
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white border-bottom" style={{ borderColor: '#e6e6e6' }}>
          <h5 className="mb-0" style={{ color: COLORS.dark }}>
            {isEditing ? 'Formulario de Edición' : 'Formulario de Registro'}
          </h5>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Solo mostrar el campo ID en modo edición */}
              {isEditing && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="personId">ID de Person</Label>
                    <Input
                      type="number"
                      name="personId"
                      id="personId"
                      value={formData.personId || ''}
                      onChange={handleChange}
                      invalid={!!errors.personId}
                      disabled={true} // Siempre deshabilitado en edición
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                    <FormFeedback>{errors.personId}</FormFeedback>
                    <small className="text-muted">
                      El ID no se puede modificar
                    </small>
                  </FormGroup>
                </Col>
              )}
              <Col md={isEditing ? 6 : 12}>
                <FormGroup>
                  <Label for="discriminator">Tipo de Persona</Label>
                  <Input
                    type="select"
                    name="discriminator"
                    id="discriminator"
                    value={formData.discriminator || ''}
                    onChange={handleChange}
                    invalid={!!errors.discriminator}
                  >
                    <option value="">Seleccione el tipo</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Student">Estudiante</option>
                  </Input>
                  <FormFeedback>{errors.discriminator}</FormFeedback>
                  {formData.discriminator && (
                    <div className="mt-2 d-flex align-items-center">
                      {getDiscriminatorIcon(formData.discriminator)}
                      <small className="text-muted">
                        {formData.discriminator === 'Instructor' 
                          ? 'Se requerirá la fecha de contratación' 
                          : 'Se requerirá la fecha de inscripción'
                        }
                      </small>
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="firstName">Nombre</Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Ingrese el nombre"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    invalid={!!errors.firstName}
                  />
                  <FormFeedback>{errors.firstName}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="lastName">Apellido</Label>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Ingrese el apellido"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    invalid={!!errors.lastName}
                  />
                  <FormFeedback>{errors.lastName}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>

            {/* Campo de fecha condicional */}
            {formData.discriminator && (
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for={getDateFieldName()}>
                      <div className="d-flex align-items-center">
                        {getDiscriminatorIcon(formData.discriminator)}
                        {getDateLabel()}
                      </div>
                    </Label>
                    <Input
                      type="datetime-local"
                      name={getDateFieldName()}
                      id={getDateFieldName()}
                      value={getDateValue()}
                      onChange={handleChange}
                      invalid={!!getDateError()}
                      max={new Date().toISOString().slice(0, 16)} // No permitir fechas futuras
                    />
                    <FormFeedback>{getDateError()}</FormFeedback>
                    <small className="text-muted">
                      {formData.discriminator === 'Instructor' 
                        ? 'Fecha en que el instructor fue contratado' 
                        : 'Fecha en que el estudiante se inscribió'
                      }
                    </small>
                  </FormGroup>
                </Col>
              </Row>
            )}

            {/* Información adicional */}
            {formData.discriminator && (
              <Alert color="info" className="mb-4">
                <div className="d-flex align-items-start">
                  {getDiscriminatorIcon(formData.discriminator)}
                  <div>
                    <strong>Información sobre {formData.discriminator === 'Instructor' ? 'Instructores' : 'Estudiantes'}:</strong>
                    <ul className="mb-0 mt-2">
                      {formData.discriminator === 'Instructor' ? (
                        <>
                          <li>Los instructores requieren una fecha de contratación</li>
                          <li>La fecha no puede ser futura</li>
                          <li>El campo de inscripción se enviará como null</li>
                          {!isEditing && <li>El ID se generará automáticamente</li>}
                        </>
                      ) : (
                        <>
                          <li>Los estudiantes requieren una fecha de inscripción</li>
                          <li>La fecha no puede ser futura</li>
                          <li>El campo de contratación se enviará como null</li>
                          {!isEditing && <li>El ID se generará automáticamente</li>}
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </Alert>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              {!isEditing && (
                <Button
                  color="light"
                  outline
                  onClick={handleReset}
                  className="d-flex align-items-center"
                  disabled={loading}
                  style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                >
                  <X size={18} className="me-1" />
                  Limpiar
                </Button>
              )}
              <Button
                type="submit"
                color="primary"
                className="d-flex align-items-center"
                style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} className="me-1" />
                    {isEditing ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default NuevoPerson;