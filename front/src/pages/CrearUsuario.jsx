import React from 'react';
import { Container } from 'reactstrap';
import FormularioMedico from '../components/FormularioMedico'; // Ajusta la ruta según tu estructura

const CrearUsuario = () => {

  return (
    <Container fluid>
      {/* Puedes agregar aquí cualquier encabezado o contenido adicional que necesites */}
      <h1 className="my-4">Crear Nuevo Médico</h1>
      
      {/* Integramos directamente el formulario */}
      <FormularioMedico />
    </Container>
  );
};

export default CrearUsuario;