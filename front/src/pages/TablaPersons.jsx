import React, { useState, useEffect } from 'react';
import { Home, Eye, Edit2, Trash2, AlertCircle, Search, Calendar, ArrowUp, ArrowDown, Plus, User, UserCheck, Award  } from 'react-feather';
import {
    Container, Row, Col, Card, CardHeader, CardBody, Button,
    Table, Alert, Spinner, Badge, Input, InputGroup, InputGroupText,
    Form, FormGroup, Label, Collapse
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { ToastNotification } from '../components/ToastNotification';
import PersonModal from '../components/PersonModal';
import usePersons from '../hooks/usePersons';

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

const TablaPersons = () => {
    const {
        persons,
        personSeleccionado,
        loading,
        error,
        showModal,
        modalMode,
        deletePerson,
        handleOpenModal,
        handleCloseModal
    } = usePersons();

    // Estado para filtros y ordenamiento
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [discriminatorFilter, setDiscriminatorFilter] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Efecto para aplicar filtros cuando cambien las dependencias
    useEffect(() => {
        applyFilters();
    }, [persons, searchTerm, dateFrom, dateTo, discriminatorFilter, sortConfig]);

    // Manejador para ordenar al hacer clic en los encabezados
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Función para aplicar todos los filtros y ordenamiento
    const applyFilters = () => {
        let filteredData = [...persons];

        // Filtrar por término de búsqueda (ID, nombre o apellido)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredData = filteredData.filter(
                person =>
                    person.personId.toString().includes(term) ||
                    person.firstName.toLowerCase().includes(term) ||
                    person.lastName.toLowerCase().includes(term)
            );
        }

        // Filtrar por tipo de persona (discriminator)
        if (discriminatorFilter) {
            filteredData = filteredData.filter(
                person => person.discriminator === discriminatorFilter
            );
        }

        // Filtrar por fecha desde (usando la fecha relevante según el discriminator)
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            filteredData = filteredData.filter(person => {
                const relevantDate = person.discriminator === 'Instructor' ? person.hireDate : person.enrollmentDate;
                return relevantDate && new Date(relevantDate) >= fromDate;
            });
        }

        // Filtrar por fecha hasta (usando la fecha relevante según el discriminator)
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // Establecer al final del día
            filteredData = filteredData.filter(person => {
                const relevantDate = person.discriminator === 'Instructor' ? person.hireDate : person.enrollmentDate;
                return relevantDate && new Date(relevantDate) <= toDate;
            });
        }

        // Aplicar ordenamiento
        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                let valueA = a[sortConfig.key];
                let valueB = b[sortConfig.key];

                // Manejar caso especial para fechas
                if (sortConfig.key === 'hireDate' || sortConfig.key === 'enrollmentDate') {
                    valueA = valueA ? new Date(valueA) : new Date(0);
                    valueB = valueB ? new Date(valueB) : new Date(0);
                }

                // Manejar caso especial para números
                if (sortConfig.key === 'personId') {
                    valueA = parseFloat(valueA);
                    valueB = parseFloat(valueB);
                }

                // Manejar strings
                if (typeof valueA === 'string') {
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }

                if (valueA < valueB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredPersons(filteredData);
    };

    // Renderizado del ícono de ordenamiento
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === 'ascending' ?
            <ArrowUp size={14} className="ms-1" /> :
            <ArrowDown size={14} className="ms-1" />;
    };

    // Función para formatear la fecha y hora completa
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Función para obtener el badge del tipo de persona
    const getPersonTypeBadge = (discriminator) => {
        const config = {
            'Instructor': {
                color: 'primary',
                icon: <UserCheck size={12} className="me-1" />,
                text: 'Instructor'
            },
            'Student': {
                color: 'info',
                icon: <Award  size={12} className="me-1" />,
                text: 'Estudiante'
            }
        };

        const typeConfig = config[discriminator] || {
            color: 'secondary',
            icon: <User size={12} className="me-1" />,
            text: discriminator || 'Desconocido'
        };

        return (
            <Badge color={typeConfig.color} className="d-flex align-items-center" style={{ fontSize: '0.75em', width: 'fit-content' }}>
                {typeConfig.icon}
                {typeConfig.text}
            </Badge>
        );
    };

    // Función para obtener la fecha relevante según el tipo de persona
    const getRelevantDate = (person) => {
        return person.discriminator === 'Instructor' ? person.hireDate : person.enrollmentDate;
    };

    // Función para obtener el label de la fecha relevante
    const getDateLabel = (discriminator) => {
        return discriminator === 'Instructor' ? 'Fecha Contratación' : 'Fecha Inscripción';
    };

    const handleDelete = async () => {
        if (personSeleccionado) {
            const success = await deletePerson(personSeleccionado.personId);
            if (success) {
                handleCloseModal();
            }
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setDateFrom('');
        setDateTo('');
        setDiscriminatorFilter('');
        setSortConfig({ key: null, direction: 'ascending' });
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
                        <User size={24} className="me-2" style={{ color: COLORS.primary }} />
                        <h1 className="mb-0 fs-2 fw-bold" style={{ color: COLORS.dark }}>
                            Administración de Personas
                        </h1>
                    </div>
                </Col>
                <Col xs="auto">
                    <Link to="/crear_person" style={{ textDecoration: 'none' }}>
                        <Button
                            color="primary"
                            className="d-flex align-items-center"
                            style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary }}
                        >
                            <Plus size={18} className="me-1" />
                            Nueva Persona
                        </Button>
                    </Link>
                </Col>
            </Row>

            {/* Card container */}
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
                                borderColor: '#4b5320',
                                color: '#4b5320',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#4b5320';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#4b5320';
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
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="searchTerm">Buscar por ID o Nombre</Label>
                                        <InputGroup>
                                            <InputGroupText style={{ backgroundColor: COLORS.light }}>
                                                <Search size={16} />
                                            </InputGroupText>
                                            <Input
                                                type="text"
                                                id="searchTerm"
                                                placeholder="Filtrar por ID, nombre o apellido..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="discriminatorFilter">Tipo de Persona</Label>
                                        <InputGroup>
                                            <InputGroupText style={{ backgroundColor: COLORS.light }}>
                                                <User size={16} />
                                            </InputGroupText>
                                            <Input
                                                type="select"
                                                id="discriminatorFilter"
                                                value={discriminatorFilter}
                                                onChange={(e) => setDiscriminatorFilter(e.target.value)}
                                            >
                                                <option value="">Todos</option>
                                                <option value="Instructor">Instructor</option>
                                                <option value="Student">Estudiante</option>
                                            </Input>
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="dateFrom">Fecha desde</Label>
                                        <InputGroup>
                                            <InputGroupText style={{ backgroundColor: COLORS.light }}>
                                                <Calendar size={16} />
                                            </InputGroupText>
                                            <Input
                                                type="date"
                                                id="dateFrom"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="dateTo">Fecha hasta</Label>
                                        <InputGroup>
                                            <InputGroupText style={{ backgroundColor: COLORS.light }}>
                                                <Calendar size={16} />
                                            </InputGroupText>
                                            <Input
                                                type="date"
                                                id="dateTo"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                            />
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
                                    onClick={applyFilters}
                                >
                                    Aplicar filtros
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Collapse>
            </Card>

            <Card className="shadow-sm border-0">
                <CardHeader className="bg-white border-bottom" style={{ borderColor: '#e6e6e6' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0" style={{ color: COLORS.dark }}>
                            Lista de Personas
                        </h5>
                        <span className="text-muted small">
                            {filteredPersons.length} {filteredPersons.length === 1 ? 'registro' : 'registros'}
                        </span>
                    </div>
                </CardHeader>
                <CardBody className="p-0">
                    {/* Table */}
                    <div className="table-responsive">
                        <Table hover bordered={false} className="mb-0">
                            <thead style={{ backgroundColor: COLORS.light }}>
                                <tr>
                                    <th
                                        className="border-0 cursor-pointer"
                                        width="10%"
                                        onClick={() => handleSort('personId')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            ID {renderSortIcon('personId')}
                                        </div>
                                    </th>
                                    <th
                                        className="border-0 cursor-pointer"
                                        width="20%"
                                        onClick={() => handleSort('firstName')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            Nombre {renderSortIcon('firstName')}
                                        </div>
                                    </th>
                                    <th
                                        className="border-0 cursor-pointer"
                                        width="20%"
                                        onClick={() => handleSort('lastName')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            Apellido {renderSortIcon('lastName')}
                                        </div>
                                    </th>
                                    <th
                                        className="border-0 cursor-pointer"
                                        width="15%"
                                        onClick={() => handleSort('discriminator')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            Tipo {renderSortIcon('discriminator')}
                                        </div>
                                    </th>
                                    <th className="border-0" width="20%">
                                        Fecha Relevante
                                    </th>
                                    <th className="border-0 text-end" width="15%">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <Spinner size="sm" color="primary" style={{ color: COLORS.primary }} className="me-2" />
                                            Cargando personas...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <Alert color="danger" className="mb-0 d-inline-flex py-1 px-3 align-items-center">
                                                <AlertCircle size={16} className="me-2" />
                                                {error}
                                            </Alert>
                                        </td>
                                    </tr>
                                ) : filteredPersons.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No hay personas que coincidan con los criterios de búsqueda
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPersons.map((person) => (
                                        <tr key={person.personId}>
                                            <td className="align-middle">
                                                <Badge
                                                    pill
                                                    className="bg-light text-dark border"
                                                    style={{ fontSize: '0.85em' }}
                                                >
                                                    {person.personId}
                                                </Badge>
                                            </td>
                                            <td className="align-middle fw-medium">
                                                {person.firstName}
                                            </td>
                                            <td className="align-middle fw-medium">
                                                {person.lastName}
                                            </td>
                                            <td className="align-middle">
                                                {getPersonTypeBadge(person.discriminator)}
                                            </td>
                                            <td className="align-middle small">
                                                <div>
                                                    <small className="text-muted d-block">
                                                        {getDateLabel(person.discriminator)}
                                                    </small>
                                                    {formatDateTime(getRelevantDate(person))}
                                                </div>
                                            </td>
                                            <td className="align-middle text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Button
                                                        color="light"
                                                        size="sm"
                                                        outline
                                                        className="btn-icon rounded-circle"
                                                        onClick={() => handleOpenModal('view', person)}
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={16} style={{ color: COLORS.primary }} />
                                                    </Button>
                                                    <Button
                                                        color="light"
                                                        size="sm"
                                                        outline
                                                        className="btn-icon rounded-circle"
                                                        onClick={() => handleOpenModal('edit', person)}
                                                        title="Editar persona"
                                                    >
                                                        <Edit2 size={16} style={{ color: COLORS.warning }} />
                                                    </Button>
                                                    <Button
                                                        color="light"
                                                        size="sm"
                                                        outline
                                                        className="btn-icon rounded-circle"
                                                        onClick={() => handleOpenModal('delete', person)}
                                                        title="Eliminar persona"
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
            <PersonModal
                isOpen={showModal}
                onClose={handleCloseModal}
                mode={modalMode}
                person={personSeleccionado}
                onDelete={handleDelete}
                colors={COLORS}
            />
        </Container>
    );
};

export default TablaPersons;