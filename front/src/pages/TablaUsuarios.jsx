import React, { useState, useEffect } from 'react';
import { 
  Home, Eye, Edit2, Trash2, AlertCircle, Search, Calendar, 
  ArrowUp, ArrowDown, Plus, User, UserCheck, Award, LifeBuoy  
} from 'react-feather';
import {
  Container, Row, Col, Card, CardHeader, CardBody, Button,
  Table, Alert, Spinner, Badge, Input, InputGroup, InputGroupText,
  Form, FormGroup, Label, Collapse
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { ToastNotification } from '../components/ToastNotification';
import UsuarioModal from '../components/UsuarioModal';
import useUsuarios from '../hooks/useUsuarios';

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

const TablaUsuarios = () => {
  const {
    usuarios,
    usuarioSeleccionado,
    loading,
    error,
    showModal,
    modalMode,
    deleteUsuario,
    handleOpenModal,
    handleCloseModal,
    refreshUsuarios
  } = useUsuarios();

  // Estado para filtros
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Aplicar filtros
  useEffect(() => {
    let result = [...usuarios];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.NumeroIdentificacion.toLowerCase().includes(term) ||
        user.Nombre.toLowerCase().includes(term) ||
        user.PrimerApellido.toLowerCase().includes(term) ||
        user.SegundoApellido?.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por tipo de usuario
    if (tipoUsuario) {
      result = result.filter(user => user.Rol.Nombre === tipoUsuario);
    }
    
    setFilteredUsuarios(result);
  }, [usuarios, searchTerm, tipoUsuario]);

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
      'Medico': { color: 'danger', icon: LifeBuoy , text: 'Médico' }
    };
    
    const item = config[rol] || { color: 'secondary', icon: User, text: rol };
    const Icon = item.icon;
    
    return (
      <Badge color={item.color} className="d-flex align-items-center" style={{ fontSize: '0.75em' }}>
        <Icon size={12} className="me-1" />
        {item.text}
      </Badge>
    );
  };

  // Obtener información específica según el tipo de usuario
  const getInfoEspecifica = (usuario) => {
    if (usuario.Rol.Nombre === 'Medico') {
      return {
        label: 'Licencia',
        value: usuario.NumeroLicencia || 'N/A'
      };
    } else {
      return {
        label: 'Tipo Sangre',
        value: usuario.TipoSangre || 'N/A'
      };
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setTipoUsuario('');
  };

  return (
    <Container fluid className="py-4">
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
            <User size={24} className="me-2" style={{ color: COLORS.primary }} />
            <h1 className="mb-0 fs-2 fw-bold" style={{ color: COLORS.dark }}>
              Administración de Usuarios
            </h1>
          </div>
        </Col>
        <Col xs="auto">
          <Link to="/crear_usuario" style={{ textDecoration: 'none' }}>
            <Button
              color="primary"
              className="d-flex align-items-center"
              style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary }}
            >
              <Plus size={18} className="me-1" />
              Nuevo Usuario
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Filtros */}
      <Card className="shadow-sm border-0 mb-4">
        <CardHeader className="bg-white border-bottom" style={{ borderColor: '#e6e6e6' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0" style={{ color: COLORS.dark }}>
              Filtros de búsqueda
            </h5>
            <Button
              color="light"
              size="sm"
              outline
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{
                borderColor: COLORS.primary,
                color: COLORS.primary,
                transition: 'all 0.3s ease'
              }}
            >
              {isFilterOpen ? 'Ocultar' : 'Mostrar'} filtros
            </Button>
          </div>
        </CardHeader>
        <Collapse isOpen={isFilterOpen}>
          <CardBody>
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="searchTerm">Buscar</Label>
                    <InputGroup>
                      <InputGroupText style={{ backgroundColor: COLORS.light }}>
                        <Search size={16} />
                      </InputGroupText>
                      <Input
                        type="text"
                        id="searchTerm"
                        placeholder="Buscar por cédula, nombre o apellido..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="tipoUsuario">Tipo de Usuario</Label>
                    <InputGroup>
                      <InputGroupText style={{ backgroundColor: COLORS.light }}>
                        <User size={16} />
                      </InputGroupText>
                      <Input
                        type="select"
                        id="tipoUsuario"
                        value={tipoUsuario}
                        onChange={(e) => setTipoUsuario(e.target.value)}
                      >
                        <option value="">Todos</option>
                        <option value="Paciente">Paciente</option>
                        <option value="Medico">Médico</option>
                      </Input>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <Button
                  color="light"
                  outline
                  onClick={handleResetFilters}
                  style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  size="sm"
                  className="me-2"
                >
                  Limpiar filtros
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary }}
                  onClick={refreshUsuarios}
                >
                  Refrescar datos
                </Button>
              </div>
            </Form>
          </CardBody>
        </Collapse>
      </Card>

      {/* Tabla */}
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white border-bottom" style={{ borderColor: '#e6e6e6' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0" style={{ color: COLORS.dark }}>
              Lista de Usuarios
            </h5>
            <span className="text-muted small">
              {filteredUsuarios.length} {filteredUsuarios.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover bordered={false} className="mb-0">
              <thead style={{ backgroundColor: COLORS.light }}>
                <tr>
                  <th width="10%">Cédula</th>
                  <th width="20%">Nombre</th>
                  <th width="20%">Apellidos</th>
                  <th width="15%">Tipo</th>
                  <th width="15%">Información</th>
                  <th width="10%">Nacimiento</th>
                  <th width="10%" className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <Spinner size="sm" color="primary" className="me-2" />
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <Alert color="danger" className="mb-0 d-inline-flex py-1 px-3 align-items-center">
                        <AlertCircle size={16} className="me-2" />
                        {error}
                      </Alert>
                    </td>
                  </tr>
                ) : filteredUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No hay usuarios que coincidan con los criterios de búsqueda
                    </td>
                  </tr>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <tr key={usuario.IdUsuario || usuario.IdPaciente || usuario.IdMedico}>
                      <td className="align-middle">
                        <Badge pill className="bg-light text-dark border" style={{ fontSize: '0.85em' }}>
                          {usuario.NumeroIdentificacion}
                        </Badge>
                      </td>
                      <td className="align-middle fw-medium">
                        {usuario.Nombre}
                      </td>
                      <td className="align-middle fw-medium">
                        {usuario.PrimerApellido} {usuario.SegundoApellido}
                      </td>
                      <td className="align-middle">
                        {getTipoUsuarioBadge(usuario.Rol?.Nombre)}
                      </td>
                      <td className="align-middle small">
                        <div>
                          <small className="text-muted d-block">
                            {getInfoEspecifica(usuario).label}
                          </small>
                          {getInfoEspecifica(usuario).value}
                        </div>
                      </td>
                      <td className="align-middle">
                        {formatDate(usuario.FechaNacimiento)}
                      </td>
                      <td className="align-middle text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button
                            color="light"
                            size="sm"
                            outline
                            className="btn-icon rounded-circle"
                            onClick={() => handleOpenModal('view', usuario)}
                            title="Ver detalles"
                          >
                            <Eye size={16} style={{ color: COLORS.primary }} />
                          </Button>
                          <Button
                            color="light"
                            size="sm"
                            outline
                            className="btn-icon rounded-circle"
                            onClick={() => handleOpenModal('edit', usuario)}
                            title="Editar usuario"
                          >
                            <Edit2 size={16} style={{ color: COLORS.warning }} />
                          </Button>
                          <Button
                            color="light"
                            size="sm"
                            outline
                            className="btn-icon rounded-circle"
                            onClick={() => handleOpenModal('delete', usuario)}
                            title="Eliminar usuario"
                          >
                            <Trash2 size={16} style={{ color: COLORS.danger }} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Modal */}
      <UsuarioModal
        isOpen={showModal}
        onClose={handleCloseModal}
        mode={modalMode}
        usuario={usuarioSeleccionado}
        onDelete={deleteUsuario}
        colors={COLORS}
      />
    </Container>
  );
};

export default TablaUsuarios;