import React, { useState, useEffect } from 'react';
import { Home, Eye, Edit2, Trash2, AlertCircle, Search, Calendar, ArrowUp, ArrowDown, Plus, DollarSign } from 'react-feather';
import {
    Container, Row, Col, Card, CardHeader, CardBody, Button,
    Table, Alert, Spinner, Badge, Input, InputGroup, InputGroupText,
    Form, FormGroup, Label, Collapse
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { ToastNotification } from '../components/ToastNotification';
import DepartmentModal from '../components/DepartmentModal';
import useDepartments from '../hooks/useDepartments';

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

const TablaDepartments = () => {
    const {
        departments,
        departmentSeleccionado,
        loading,
        error,
        showModal,
        modalMode,
        deleteDepartment,
        handleOpenModal,
        handleCloseModal
    } = useDepartments();

    // Estado para filtros y ordenamiento
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Efecto para aplicar filtros cuando cambien las dependencias
    useEffect(() => {
        applyFilters();
    }, [departments, searchTerm, dateFrom, dateTo, budgetMin, budgetMax, sortConfig]);

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
        let filteredData = [...departments];

        // Filtrar por término de búsqueda (ID o nombre)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredData = filteredData.filter(
                department =>
                    department.departmentId.toString().includes(term) ||
                    department.name.toLowerCase().includes(term)
            );
        }

        // Filtrar por fecha desde
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            filteredData = filteredData.filter(
                department => new Date(department.startDate) >= fromDate
            );
        }

        // Filtrar por fecha hasta
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // Establecer al final del día
            filteredData = filteredData.filter(
                department => new Date(department.startDate) <= toDate
            );
        }

        // Filtrar por presupuesto mínimo
        if (budgetMin) {
            filteredData = filteredData.filter(
                department => department.budget >= parseFloat(budgetMin)
            );
        }

        // Filtrar por presupuesto máximo
        if (budgetMax) {
            filteredData = filteredData.filter(
                department => department.budget <= parseFloat(budgetMax)
            );
        }

        // Aplicar ordenamiento
        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                let valueA = a[sortConfig.key];
                let valueB = b[sortConfig.key];

                // Manejar caso especial para fechas
                if (sortConfig.key === 'startDate') {
                    valueA = new Date(valueA);
                    valueB = new Date(valueB);
                }

                // Manejar caso especial para números
                if (sortConfig.key === 'budget' || sortConfig.key === 'departmentId') {
                    valueA = parseFloat(valueA);
                    valueB = parseFloat(valueB);
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

        setFilteredDepartments(filteredData);
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
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Función para formatear el presupuesto
    const formatBudget = (budget) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(budget);
    };

    const handleDelete = async () => {
        if (departmentSeleccionado) {
            const success = await deleteDepartment(departmentSeleccionado.departmentId);
            if (success) {
                handleCloseModal();
            }
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setDateFrom('');
        setDateTo('');
        setBudgetMin('');
        setBudgetMax('');
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
                        <Home size={24} className="me-2" style={{ color: COLORS.primary }} />
                        <h1 className="mb-0 fs-2 fw-bold" style={{ color: COLORS.dark }}>
                            Administración de Departments
                        </h1>
                    </div>
                </Col>
                <Col xs="auto">
                    <Link to="/crear_department" style={{ textDecoration: 'none' }}>
                        <Button
                            color="primary"
                            className="d-flex align-items-center"
                            style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary }}
                        >
                            <Plus size={18} className="me-1" />
                            Nuevo Department
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
                                                placeholder="Filtrar por ID o nombre..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
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
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="budgetMin">Presupuesto mínimo</Label>
                                        <InputGroup>
                                            <InputGroupText style={{ backgroundColor: COLORS.light }}>
                                                <DollarSign size={16} />
                                            </InputGroupText>
                                            <Input
                                                type="number"
                                                id="budgetMin"
                                                placeholder="Mínimo"
                                                value={budgetMin}
                                                onChange={(e) => setBudgetMin(e.target.value)}
                                                min="0"
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="budgetMax">Presupuesto máximo</Label>
                                        <InputGroup>
                                            <InputGroupText style={{ backgroundColor: COLORS.light }}>
                                                <DollarSign size={16} />
                                            </InputGroupText>
                                            <Input
                                                type="number"
                                                id="budgetMax"
                                                placeholder="Máximo"
                                                value={budgetMax}
                                                onChange={(e) => setBudgetMax(e.target.value)}
                                                min="0"
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
                            Lista de Departments
                        </h5>
                        <span className="text-muted small">
                            {filteredDepartments.length} {filteredDepartments.length === 1 ? 'registro' : 'registros'}
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
                                        width="15%"
                                        onClick={() => handleSort('departmentId')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            ID {renderSortIcon('departmentId')}
                                        </div>
                                    </th>
                                    <th
                                        className="border-0 cursor-pointer"
                                        width="30%"
                                        onClick={() => handleSort('name')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            Nombre {renderSortIcon('name')}
                                        </div>
                                    </th>
                                    <th
                                        className="border-0 cursor-pointer"
                                        width="20%"
                                        onClick={() => handleSort('budget')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            Presupuesto {renderSortIcon('budget')}
                                        </div>
                                    </th>
                                    <th
                                        className="border-0 cursor-pointer"
                                        width="20%"
                                        onClick={() => handleSort('startDate')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            Fecha Inicio {renderSortIcon('startDate')}
                                        </div>
                                    </th>
                                    <th className="border-0 text-end" width="15%">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <Spinner size="sm" color="primary" style={{ color: COLORS.primary }} className="me-2" />
                                            Cargando departments...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <Alert color="danger" className="mb-0 d-inline-flex py-1 px-3 align-items-center">
                                                <AlertCircle size={16} className="me-2" />
                                                {error}
                                            </Alert>
                                        </td>
                                    </tr>
                                ) : filteredDepartments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No hay departments que coincidan con los criterios de búsqueda
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDepartments.map((department) => (
                                        <tr key={department.departmentId}>
                                            <td className="align-middle">
                                                <Badge
                                                    pill
                                                    className="bg-light text-dark border"
                                                    style={{ fontSize: '0.85em' }}
                                                >
                                                    {department.departmentId}
                                                </Badge>
                                            </td>
                                            <td className="align-middle fw-medium">
                                                {department.name}
                                            </td>
                                            <td className="align-middle">
                                                <span className="fw-bold" style={{ color: COLORS.success }}>
                                                    {formatBudget(department.budget)}
                                                </span>
                                            </td>
                                            <td className="align-middle small">
                                                {formatDateTime(department.startDate)}
                                            </td>
                                            <td className="align-middle text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Button
                                                        color="light"
                                                        size="sm"
                                                        outline
                                                        className="btn-icon rounded-circle"
                                                        onClick={() => handleOpenModal('view', department)}
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={16} style={{ color: COLORS.primary }} />
                                                    </Button>
                                                    <Button
                                                        color="light"
                                                        size="sm"
                                                        outline
                                                        className="btn-icon rounded-circle"
                                                        onClick={() => handleOpenModal('edit', department)}
                                                        title="Editar department"
                                                    >
                                                        <Edit2 size={16} style={{ color: COLORS.warning }} />
                                                    </Button>
                                                    <Button
                                                        color="light"
                                                        size="sm"
                                                        outline
                                                        className="btn-icon rounded-circle"
                                                        onClick={() => handleOpenModal('delete', department)}
                                                        title="Eliminar department"
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
            <DepartmentModal
                isOpen={showModal}
                onClose={handleCloseModal}
                mode={modalMode}
                department={departmentSeleccionado}
                onDelete={handleDelete}
                colors={COLORS}
            />
        </Container>
    );
};

export default TablaDepartments;