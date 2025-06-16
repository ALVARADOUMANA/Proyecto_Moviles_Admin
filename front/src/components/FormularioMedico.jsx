import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col, Spinner } from 'reactstrap';
import { 
  User, CreditCard, Calendar, Info, Award, Book, 
  Phone, MapPin, ArrowLeft, Save 
} from 'react-feather';
import { insertarMedico } from '../hooks/useApi';
import { showToast } from '../components/ToastNotification';

const FormularioMedico = ({ correo, codigo, onRegistroCompletado, onError, onLoading, onVolver }) => {
  const [formData, setFormData] = useState({
    CorreoElectronico: correo,
    CodigoVerificacion: codigo,
    NumeroIdentificacion: '',
    Nombre: '',
    PrimerApellido: '',
    SegundoApellido: '',
    FechaNacimiento: '',
    Genero: '',
    Telefono: '',
    Pais: 'Costa Rica',
    Provincia: '',
    Canton: '',
    Distrito: '',
    DireccionExacta: '',
    Contrasenna: '',
    ConfirmarContrasenna: '',
    NumeroLicencia: '',
    Biografia: '',
    AnnosExperiencia: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar error si existe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'NumeroIdentificacion', 'Nombre', 'PrimerApellido', 
      'FechaNacimiento', 'Genero', 'Telefono', 
      'Provincia', 'Canton', 'Distrito',
      'Contrasenna', 'ConfirmarContrasenna',
      'NumeroLicencia', 'AnnosExperiencia'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo es requerido';
      }
    });

    if (formData.Contrasenna !== formData.ConfirmarContrasenna) {
      newErrors.ConfirmarContrasenna = 'Las contraseñas no coinciden';
    }

    if (formData.Contrasenna && formData.Contrasenna.length < 6) {
      newErrors.Contrasenna = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.AnnosExperiencia && isNaN(formData.AnnosExperiencia)) {
      newErrors.AnnosExperiencia = 'Debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onError(null);

    if (!validateForm()) {
      onError('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      onLoading(true);

      // Preparar datos para enviar (excluyendo ConfirmarContrasenna)
      const { ConfirmarContrasenna, ...dataToSend } = formData;
      dataToSend.AnnosExperiencia = parseInt(dataToSend.AnnosExperiencia);

      const response = await insertarMedico(dataToSend);

      if (response.data.resultado) {
        showToast.success('Médico registrado exitosamente');
        if (onRegistroCompletado) onRegistroCompletado();
      } else {
        onError(response.data.error || 'Error al registrar el médico');
      }
    } catch (error) {
      console.error('Error:', error);
      onError('Error al registrar el médico');
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h5 className="mb-4">Información Personal</h5>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="NumeroIdentificacion">
              <CreditCard size={16} className="me-2" />
              Número de Identificación
            </Label>
            <Input
              type="text"
              name="NumeroIdentificacion"
              id="NumeroIdentificacion"
              value={formData.NumeroIdentificacion}
              onChange={handleChange}
              invalid={!!errors.NumeroIdentificacion}
            />
            {errors.NumeroIdentificacion && <div className="text-danger small">{errors.NumeroIdentificacion}</div>}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Telefono">
              <Phone size={16} className="me-2" />
              Teléfono
            </Label>
            <Input
              type="tel"
              name="Telefono"
              id="Telefono"
              value={formData.Telefono}
              onChange={handleChange}
              invalid={!!errors.Telefono}
            />
            {errors.Telefono && <div className="text-danger small">{errors.Telefono}</div>}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <FormGroup>
            <Label for="Nombre">
              <User size={16} className="me-2" />
              Nombre
            </Label>
            <Input
              type="text"
              name="Nombre"
              id="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
              invalid={!!errors.Nombre}
            />
            {errors.Nombre && <div className="text-danger small">{errors.Nombre}</div>}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="PrimerApellido">Primer Apellido</Label>
            <Input
              type="text"
              name="PrimerApellido"
              id="PrimerApellido"
              value={formData.PrimerApellido}
              onChange={handleChange}
              invalid={!!errors.PrimerApellido}
            />
            {errors.PrimerApellido && <div className="text-danger small">{errors.PrimerApellido}</div>}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="SegundoApellido">Segundo Apellido</Label>
            <Input
              type="text"
              name="SegundoApellido"
              id="SegundoApellido"
              value={formData.SegundoApellido}
              onChange={handleChange}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="FechaNacimiento">
              <Calendar size={16} className="me-2" />
              Fecha de Nacimiento
            </Label>
            <Input
              type="date"
              name="FechaNacimiento"
              id="FechaNacimiento"
              value={formData.FechaNacimiento}
              onChange={handleChange}
              invalid={!!errors.FechaNacimiento}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.FechaNacimiento && <div className="text-danger small">{errors.FechaNacimiento}</div>}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="Genero">
              <Info size={16} className="me-2" />
              Género
            </Label>
            <Input
              type="select"
              name="Genero"
              id="Genero"
              value={formData.Genero}
              onChange={handleChange}
              invalid={!!errors.Genero}
            >
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </Input>
            {errors.Genero && <div className="text-danger small">{errors.Genero}</div>}
          </FormGroup>
        </Col>
      </Row>

      <h5 className="mb-4 mt-5">Información Profesional</h5>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="NumeroLicencia">
              <Award size={16} className="me-2" />
              Número de Licencia Médica
            </Label>
            <Input
              type="text"
              name="NumeroLicencia"
              id="NumeroLicencia"
              value={formData.NumeroLicencia}
              onChange={handleChange}
              invalid={!!errors.NumeroLicencia}
            />
            {errors.NumeroLicencia && <div className="text-danger small">{errors.NumeroLicencia}</div>}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="AnnosExperiencia">
              <Book size={16} className="me-2" />
              Años de Experiencia
            </Label>
            <Input
              type="number"
              name="AnnosExperiencia"
              id="AnnosExperiencia"
              value={formData.AnnosExperiencia}
              onChange={handleChange}
              invalid={!!errors.AnnosExperiencia}
              min="0"
              max="50"
            />
            {errors.AnnosExperiencia && <div className="text-danger small">{errors.AnnosExperiencia}</div>}
          </FormGroup>
        </Col>
      </Row>

      <FormGroup>
        <Label for="Biografia">Biografía</Label>
        <Input
          type="textarea"
          name="Biografia"
          id="Biografia"
          value={formData.Biografia}
          onChange={handleChange}
          rows="4"
          placeholder="Describa su formación académica, especialidades y experiencia profesional"
        />
      </FormGroup>

      <h5 className="mb-4 mt-5">Información de Contacto</h5>
      <Row>
        <Col md={3}>
          <FormGroup>
            <Label for="Pais">
              <MapPin size={16} className="me-2" />
              País
            </Label>
            <Input
              type="text"
              name="Pais"
              id="Pais"
              value={formData.Pais}
              onChange={handleChange}
              disabled
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="Provincia">Provincia</Label>
            <Input
              type="text"
              name="Provincia"
              id="Provincia"
              value={formData.Provincia}
              onChange={handleChange}
              invalid={!!errors.Provincia}
            />
            {errors.Provincia && <div className="text-danger small">{errors.Provincia}</div>}
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="Canton">Cantón</Label>
            <Input
              type="text"
              name="Canton"
              id="Canton"
              value={formData.Canton}
              onChange={handleChange}
              invalid={!!errors.Canton}
            />
            {errors.Canton && <div className="text-danger small">{errors.Canton}</div>}
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="Distrito">Distrito</Label>
            <Input
              type="text"
              name="Distrito"
              id="Distrito"
              value={formData.Distrito}
              onChange={handleChange}
              invalid={!!errors.Distrito}
            />
            {errors.Distrito && <div className="text-danger small">{errors.Distrito}</div>}
          </FormGroup>
        </Col>
      </Row>

      <FormGroup>
        <Label for="DireccionExacta">Dirección Exacta</Label>
        <Input
          type="textarea"
          name="DireccionExacta"
          id="DireccionExacta"
          value={formData.DireccionExacta}
          onChange={handleChange}
          placeholder="Ej: 200 metros norte del parque central"
        />
      </FormGroup>

      <h5 className="mb-4 mt-5">Seguridad</h5>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="Contrasenna">Contraseña</Label>
            <Input
              type="password"
              name="Contrasenna"
              id="Contrasenna"
              value={formData.Contrasenna}
              onChange={handleChange}
              invalid={!!errors.Contrasenna}
            />
            {errors.Contrasenna && <div className="text-danger small">{errors.Contrasenna}</div>}
            <small className="text-muted">Mínimo 6 caracteres</small>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="ConfirmarContrasenna">Confirmar Contraseña</Label>
            <Input
              type="password"
              name="ConfirmarContrasenna"
              id="ConfirmarContrasenna"
              value={formData.ConfirmarContrasenna}
              onChange={handleChange}
              invalid={!!errors.ConfirmarContrasenna}
            />
            {errors.ConfirmarContrasenna && <div className="text-danger small">{errors.ConfirmarContrasenna}</div>}
          </FormGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-5">
        <Button
          color="secondary"
          type="button"
          onClick={onVolver}
        >
          <ArrowLeft size={18} className="me-2" />
          Volver
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Registrando...
            </>
          ) : (
            <>
              <Save size={18} className="me-2" />
              Registrar Médico
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default FormularioMedico;