import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Save, X } from 'react-feather';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Button,
  Form, FormGroup, Label, Input, FormFeedback, Spinner
} from 'reactstrap';
import { ToastNotification } from '../components/ToastNotification';
import useDepartmentForm from '../hooks/useDepartmentForm';
import { obtenerDepartmentPorId } from '../hooks/useApi';

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

const NuevoDepartment = () => {
  const { id } = useParams(); // Para editar un department existente
  const isEditing = !!id;
  const navigate = useNavigate();

  // Callback de éxito que será ejecutado después de guardar o actualizar
  const handleSuccess = useCallback(() => {
    // Redireccionar a la tabla después de guardar exitosamente
    setTimeout(() => {
      navigate('/tabla_departments');
    }, 1500); // Retraso de 1.5 segundos para que el usuario vea el toast de éxito
  }, [navigate]);

  const {
    formData,
    loading,
    errors,
    setFormData,
    handleChange,
    createDepartment,
    updateDepartment,
    resetForm
  } = useDepartmentForm(null, handleSuccess);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (isEditing) {
        try {
          const response = await obtenerDepartmentPorId(id);
          // Formatear la fecha para el input datetime-local
          const departmentData = {
            ...response.data,
            startDate: response.data.startDate ? new Date(response.data.startDate).toISOString().slice(0, 16) : ''
          };
          setFormData(departmentData);
        } catch (error) {
          // Error handling would be managed by the toast notification
        }
      }
    };

    fetchDepartment();
  }, [id, isEditing, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;

    if (isEditing) {
      success = await updateDepartment();
    } else {
      success = await createDepartment();
    }
    // La redirección ahora está controlada por handleSuccess que se ejecuta cuando es exitoso
  };

  const handleReset = () => {
    resetForm();
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
              {isEditing ? 'Editar Department' : 'Nuevo Department'}
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
              <Col md={6}>
                <FormGroup>
                  <Label for="departmentId">ID de Department</Label>
                  <Input
                    type="number"
                    name="departmentId"
                    id="departmentId"
                    placeholder="Ingrese el ID de Department"
                    value={formData.departmentId || ''}
                    onChange={handleChange}
                    invalid={!!errors.departmentId}
                    disabled={isEditing} // No permitir editar el ID si estamos editando
                  />
                  <FormFeedback>{errors.departmentId}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Nombre</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Ingrese el nombre del department"
                    value={formData.name || ''}
                    onChange={handleChange}
                    invalid={!!errors.name}
                  />
                  <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="budget">Presupuesto</Label>
                  <Input
                    type="number"
                    name="budget"
                    id="budget"
                    placeholder="Ingrese el presupuesto"
                    value={formData.budget || ''}
                    onChange={handleChange}
                    invalid={!!errors.budget}
                    step="0.01"
                    min="0"
                  />
                  <FormFeedback>{errors.budget}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="startDate">Fecha de Inicio</Label>
                  <Input
                    type="datetime-local"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    invalid={!!errors.startDate}
                  />
                  <FormFeedback>{errors.startDate}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>

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

export default NuevoDepartment;