// front\src\pages\auth\Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button,
  Alert,
  Spinner
} from 'reactstrap';
import { 
  User, 
  Lock, 
  LogIn,
  Eye,
  EyeOff
} from 'react-feather';
import { loginUser } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // SISMED color scheme - blue and white
  const primaryBlue = '#1E4B8B';
  const lighterBlue = '#E6F0FA';
  const white = '#FFFFFF';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.userName.trim() || !formData.password.trim()) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await loginUser(formData);
      
      // Redireccionar al dashboard/home
      navigate('/');
      
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas o usuario no autorizado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center"
      style={{
        backgroundColor: white,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card 
              className="shadow-lg border-0"
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                border: `1px solid ${lighterBlue}`
              }}
            >
              {/* Header de la tarjeta */}
              <div 
                className="text-center py-4"
                style={{
                  backgroundColor: primaryBlue,
                  color: white
                }}
              >
                <div 
                  className="mx-auto mb-3"
                  style={{
                    width: '70px',
                    height: '70px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <LogIn size={35} color={white} />
                </div>
                <h3 className="mb-1 fw-bold">SISMED</h3>
                <p className="mb-0 opacity-75">Sistema Médico</p>
              </div>

              <CardBody className="p-4" style={{ backgroundColor: white }}>
                {error && (
                  <Alert color="danger" className="mb-4">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <FormGroup className="mb-3">
                    <Label for="userName" className="fw-semibold text-dark">
                      Número de Identificación
                    </Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="userName"
                        id="userName"
                        placeholder="Ingrese su número de identificación"
                        value={formData.userName}
                        onChange={handleChange}
                        className="ps-5"
                        style={{
                          borderRadius: '8px',
                          border: `1px solid ${lighterBlue}`,
                          height: '45px',
                          fontSize: '0.9rem'
                        }}
                        disabled={loading}
                      />
                      <User
                        size={18}
                        className="position-absolute"
                        style={{
                          left: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: primaryBlue
                        }}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Label for="password" className="fw-semibold text-dark">
                      Contraseña
                    </Label>
                    <div className="position-relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Ingrese su contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        className="ps-5 pe-5"
                        style={{
                          borderRadius: '8px',
                          border: `1px solid ${lighterBlue}`,
                          height: '45px',
                          fontSize: '0.9rem'
                        }}
                        disabled={loading}
                      />
                      <Lock
                        size={18}
                        className="position-absolute"
                        style={{
                          left: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: primaryBlue
                        }}
                      />
                      <button
                        type="button"
                        className="btn p-0 position-absolute"
                        style={{
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: primaryBlue
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormGroup>

                  <Button
                    type="submit"
                    className="w-100 fw-bold"
                    disabled={loading}
                    style={{
                      backgroundColor: primaryBlue,
                      borderColor: primaryBlue,
                      borderRadius: '8px',
                      height: '45px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} className="me-2" />
                        Iniciar Sesión
                      </>
                    )}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;