import { useState, useCallback } from 'react';
import { crearDepartment, actualizarDepartment } from './useApi';
import { showToast } from '../components/ToastNotification';

const useDepartmentForm = (initialData = null, onSuccess = null) => {
  const [formData, setFormData] = useState(initialData || {
    departmentId: '',
    name: '',
    budget: '',
    startDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Función para validar el formulario
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validar departmentId
    if (!formData.departmentId || formData.departmentId.trim() === '') {
      newErrors.departmentId = 'El ID de Department es requerido';
    } else if (isNaN(formData.departmentId) || parseInt(formData.departmentId) <= 0) {
      newErrors.departmentId = 'El ID de Department debe ser un número mayor a 0';
    }

    // Validar name
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar budget
    if (!formData.budget || formData.budget === '') {
      newErrors.budget = 'El presupuesto es requerido';
    } else if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'El presupuesto debe ser un número mayor a 0';
    }

    // Validar startDate
    if (!formData.startDate || formData.startDate.trim() === '') {
      newErrors.startDate = 'La fecha de inicio es requerida';
    } else {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.startDate = 'La fecha de inicio no puede ser anterior a hoy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Función para manejar cambios en los inputs
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // Función para crear un nuevo department
  const createDepartment = useCallback(async () => {
    if (!validateForm()) {
      showToast.error('Por favor, corrija los errores en el formulario');
      return false;
    }

    try {
      setLoading(true);
      
      // Preparar datos para envío
      const dataToSend = {
        departmentId: parseInt(formData.departmentId),
        name: formData.name.trim(),
        budget: parseFloat(formData.budget),
        startDate: new Date(formData.startDate).toISOString()
      };

      await crearDepartment(dataToSend);
      showToast.success('Department creado exitosamente');
      
      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Error al crear department:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          error.message || 
                          'Ha ocurrido un error al crear el department';
      showToast.error(`Error: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, onSuccess]);

  // Función para actualizar un department existente
  const updateDepartment = useCallback(async () => {
    if (!validateForm()) {
      showToast.error('Por favor, corrija los errores en el formulario');
      return false;
    }

    try {
      setLoading(true);
      
      // Preparar datos para envío
      const dataToSend = {
        departmentId: parseInt(formData.departmentId),
        name: formData.name.trim(),
        budget: parseFloat(formData.budget),
        startDate: new Date(formData.startDate).toISOString()
      };

      await actualizarDepartment(dataToSend);
      showToast.success('Department actualizado exitosamente');
      
      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Error al actualizar department:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          error.message || 
                          'Ha ocurrido un error al actualizar el department';
      showToast.error(`Error: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, onSuccess]);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData({
      departmentId: '',
      name: '',
      budget: '',
      startDate: ''
    });
    setErrors({});
  }, []);

  // Función para establecer datos del formulario (útil para edición)
  const setFormDataWithValidation = useCallback((data) => {
    if (data) {
      setFormData({
        departmentId: data.departmentId || '',
        name: data.name || '',
        budget: data.budget || '',
        startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : ''
      });
    }
    setErrors({});
  }, []);

  return {
    formData,
    loading,
    errors,
    setFormData: setFormDataWithValidation,
    handleChange,
    createDepartment,
    updateDepartment,
    resetForm,
    validateForm
  };
};

export default useDepartmentForm;