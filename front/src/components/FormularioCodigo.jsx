import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from 'reactstrap';
import { Mail, Key, ArrowLeft } from 'react-feather';
import { SignUpCode } from '../hooks/useApi';
import { showToast } from '../components/ToastNotification';

const FormularioCodigo = ({ correo, onCodigoEnviado, onCodigoVerificado, onError, onLoading }) => {
  const [email, setEmail] = useState(correo || '');
  const [codigo, setCodigo] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onError(null);

    if (!codigoEnviado) {
      // Validar correo
      if (!email) {
        setErrors({ email: 'El correo electrónico es requerido' });
        return;
      }
      if (!validateEmail(email)) {
        setErrors({ email: 'Ingrese un correo electrónico válido' });
        return;
      }

      try {
        setLoading(true);
        onLoading(true);
        
        const response = await SignUpCode({ CorreoElectronico: email });
        
        if (response.data.resultado) {
          showToast.success('Código enviado al correo electrónico');
          setCodigoEnviado(true);
          if (onCodigoEnviado) onCodigoEnviado(email);
        } else {
          onError(response.data.error || 'Error al enviar el código');
        }
      } catch (error) {
        console.error('Error:', error);
        onError('Error al enviar el código de verificación');
      } finally {
        setLoading(false);
        onLoading(false);
      }
    } else {
      // Validar código
      if (!codigo) {
        setErrors({ codigo: 'El código de verificación es requerido' });
        return;
      }

      if (onCodigoVerificado) {
        onCodigoVerificado(codigo);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {!codigoEnviado ? (
        <>
          <FormGroup>
            <Label for="email">Correo Electrónico</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              invalid={!!errors.email}
            />
            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
            <small className="text-muted">
              Se enviará un código de verificación a este correo
            </small>
          </FormGroup>

          <div className="d-flex justify-content-end mt-4">
            <Button
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail size={18} className="me-2" />
                  Enviar Código
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        <>
          <Alert color="info" className="d-flex align-items-center">
            <Mail size={18} className="me-2" />
            Código enviado a <strong className="mx-1">{email}</strong>
          </Alert>

          <FormGroup>
            <Label for="codigo">Código de Verificación</Label>
            <Input
              type="text"
              name="codigo"
              id="codigo"
              placeholder="Ingrese el código de 6 dígitos"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value);
                if (errors.codigo) setErrors({ ...errors, codigo: null });
              }}
              invalid={!!errors.codigo}
            />
            {errors.codigo && <div className="text-danger small mt-1">{errors.codigo}</div>}
            <small className="text-muted">
              Revise su bandeja de entrada y spam
            </small>
          </FormGroup>

          <div className="d-flex justify-content-between mt-4">
            <Button
              color="secondary"
              type="button"
              onClick={() => {
                setCodigoEnviado(false);
                setCodigo('');
              }}
            >
              <ArrowLeft size={18} className="me-2" />
              Cambiar Correo
            </Button>
            <Button
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Verificando...
                </>
              ) : (
                <>
                  <Key size={18} className="me-2" />
                  Verificar Código
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default FormularioCodigo;