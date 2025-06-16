import { useState, useEffect } from 'react';
import { showToast } from '../components/ToastNotification';
import {
    obtenerEmpleados,
    obtenerEmpleadosPorId,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado 
} from '../hooks/useApi';

const useEmpleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Mantenemos la notificación para compatibilidad, pero se usará principalmente para toasts
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    
    useEffect(() => {
        console.log('1');
        fetchEmpleados();
    }, []);
    
    const fetchEmpleados = async () => {
        console.log('2');
        try {
            setLoading(true);
            const response = await obtenerEmpleados();
            setEmpleados(response.data);
            setError(null);
        } catch (err) {
            const errorMsg = 'No se pudieron cargar los datos de empleados';
            setError(errorMsg);
            showNotification(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const fetchEmpleadoDetalle = async (id) => {
        try {
            const response = await obtenerEmpleadosPorId(id);
            setEmpleadoSeleccionado(response.data);
            return response.data;
        } catch (err) {
            showNotification('Error al obtener detalles del empleado', 'error');
            return null;
        }
    };
    
    const createEmpleado = async (data) => {
        console.log('3');
        try {
            await crearEmpleado(data);
            showNotification('Empleado creado exitosamente', 'success');
            await fetchEmpleados();
            return true;
        } catch (err) {
            showNotification(`Error: ${err.message || 'Ha ocurrido un error al crear'}`, 'error');
            return false;
        }
    };
    
    const updateEmpleado = async (data) => {
        console.log('4');
        try {
            await actualizarEmpleado(data);
            showNotification('Empleado actualizado exitosamente', 'success');
            await fetchEmpleados();
            return true;
        } catch (err) {
            showNotification(`Error: ${err.message || 'Ha ocurrido un error al actualizar'}`, 'error');
            return false;
        }
    };
    
    const deleteEmpleado = async (id) => {
        console.log('5');
        try {
            await eliminarEmpleado(id);
            showNotification('Empleado eliminado exitosamente', 'success');
            await fetchEmpleados();
            return true;
        } catch (err) {
            showNotification(`Error: ${err.message || 'Ha ocurrido un error al eliminar'}`, 'error');
            return false;
        }
    };
    
    const showNotification = (message, type) => {
        // Actualizar el estado local para componentes que aún lo usen
        setNotification({ show: true, message, type });
        
        // Usar el sistema de toast personalizado
        switch (type) {
            case 'success':
                showToast.success(message);
                break;
            case 'error':
                showToast.error(message);
                break;
            case 'warning':
                showToast.warning(message);
                break;
            default:
                showToast.info(message);
        }
        
        // Limpiar la notificación local después de un tiempo
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };
    
    const formatSalario = (salario) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0
        }).format(salario);
    };
    
    return {
        empleados,
        empleadoSeleccionado,
        loading,
        error,
        notification,
        fetchEmpleadoDetalle,
        createEmpleado,
        updateEmpleado,
        deleteEmpleado,
        setEmpleadoSeleccionado,
        formatSalario,
        showNotification
    };
};

export default useEmpleados;