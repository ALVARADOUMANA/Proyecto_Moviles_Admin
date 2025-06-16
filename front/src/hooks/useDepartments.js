import { useState, useEffect, useCallback } from 'react';
import { obtenerDepartments, eliminarDepartment } from './useApi';
import { showToast } from '../components/ToastNotification';

const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentSeleccionado, setDepartmentSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'delete'

  // Función para cargar la lista de departments
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await obtenerDepartments();
      
      // Verificar si la respuesta tiene datos
      if (response.data) {
        // Si response.data es un array, usarlo directamente
        // Si tiene una propiedad que contiene el array, ajustar según la estructura de tu API
        const departmentsData = Array.isArray(response.data) ? response.data : response.data.departments || [];
        setDepartments(departmentsData);
      } else {
        setDepartments([]);
      }
    } catch (err) {
      console.error('Error al cargar departments:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.title || 
                          err.message || 
                          'Error al cargar la lista de departments';
      setError(errorMessage);
      showToast.error(`Error: ${errorMessage}`);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar departments al montar el componente
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Función para abrir el modal
  const handleOpenModal = useCallback((mode, department = null) => {
    setModalMode(mode);
    setDepartmentSeleccionado(department);
    setShowModal(true);
  }, []);

  // Función para cerrar el modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalMode('view');
    setDepartmentSeleccionado(null);
  }, []);

  // Función para eliminar un department
  const deleteDepartment = useCallback(async (departmentId) => {
    if (!departmentId) {
      showToast.error('ID de department no válido');
      return false;
    }

    try {
      setLoading(true);
      
      await eliminarDepartment(departmentId);
      
      // Actualizar la lista local removiendo el department eliminado
      setDepartments(prev => prev.filter(dept => dept.departmentId !== departmentId));
      
      showToast.success('Department eliminado exitosamente');
      
      return true;
    } catch (error) {
      console.error('Error al eliminar department:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          error.message || 
                          'Ha ocurrido un error al eliminar el department';
      showToast.error(`Error: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para refrescar la lista de departments
  const refreshDepartments = useCallback(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Función para buscar un department por ID
  const findDepartmentById = useCallback((departmentId) => {
    return departments.find(dept => dept.departmentId === departmentId);
  }, [departments]);

  // Función para agregar un nuevo department a la lista local
  const addDepartmentToList = useCallback((newDepartment) => {
    setDepartments(prev => [...prev, newDepartment]);
  }, []);

  // Función para actualizar un department en la lista local
  const updateDepartmentInList = useCallback((updatedDepartment) => {
    setDepartments(prev => 
      prev.map(dept => 
        dept.departmentId === updatedDepartment.departmentId 
          ? { ...dept, ...updatedDepartment }
          : dept
      )
    );
  }, []);

  // Función para obtener estadísticas básicas
  const getStatistics = useCallback(() => {
    if (!departments.length) {
      return {
        total: 0,
        totalBudget: 0,
        averageBudget: 0,
        maxBudget: 0,
        minBudget: 0
      };
    }

    const totalBudget = departments.reduce((sum, dept) => sum + (dept.budget || 0), 0);
    const budgets = departments.map(dept => dept.budget || 0).filter(budget => budget > 0);
    
    return {
      total: departments.length,
      totalBudget,
      averageBudget: budgets.length > 0 ? totalBudget / budgets.length : 0,
      maxBudget: budgets.length > 0 ? Math.max(...budgets) : 0,
      minBudget: budgets.length > 0 ? Math.min(...budgets) : 0
    };
  }, [departments]);

  return {
    // Estado
    departments,
    departmentSeleccionado,
    loading,
    error,
    showModal,
    modalMode,
    
    // Funciones de modal
    handleOpenModal,
    handleCloseModal,
    
    // Funciones CRUD
    deleteDepartment,
    refreshDepartments,
    addDepartmentToList,
    updateDepartmentInList,
    
    // Funciones de utilidad
    findDepartmentById,
    getStatistics,
    
    // Función para recargar datos
    fetchDepartments
  };
};

export default useDepartments;