import { useState, useCallback } from 'react';
import { crearPerson, actualizarPerson } from './useApi';
import { showToast } from '../components/ToastNotification';

const usePersonForm = (initialData = null, onSuccess = null) => {
  const [formData, setFormData] = useState(initialData || {
    personId: '', // Solo se usa para mostrar en edición, no se envía en creación
    firstName: '',
    lastName: '',
    discriminator: '',
    hireDate: '',
    enrollmentDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Función para validar el formulario
  const validateForm = useCallback((isEditing = false) => {
    const newErrors = {};

    // Validar personId solo en modo edición
    if (isEditing) {
      if (!formData.personId || formData.personId.toString().trim() === '') {
        newErrors.personId = 'El ID de Person es requerido';
      } else if (isNaN(formData.personId) || parseInt(formData.personId) <= 0) {
        newErrors.personId = 'El ID de Person debe ser un número mayor a 0';
      }
    }

    // Validar firstName
    if (!formData.firstName || formData.firstName.trim() === '') {
      newErrors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar lastName
    if (!formData.lastName || formData.lastName.trim() === '') {
      newErrors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validar discriminator
    if (!formData.discriminator || formData.discriminator.trim() === '') {
      newErrors.discriminator = 'El tipo de persona es requerido';
    } else if (!['Instructor', 'Student'].includes(formData.discriminator)) {
      newErrors.discriminator = 'El tipo debe ser Instructor o Student';
    }

    // Validar fechas según el discriminator
    if (formData.discriminator === 'Instructor') {
      if (!formData.hireDate || formData.hireDate.trim() === '') {
        newErrors.hireDate = 'La fecha de contratación es requerida para instructores';
      } else {
        const selectedDate = new Date(formData.hireDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate > today) {
          newErrors.hireDate = 'La fecha de contratación no puede ser futura';
        }
      }
    } else if (formData.discriminator === 'Student') {
      if (!formData.enrollmentDate || formData.enrollmentDate.trim() === '') {
        newErrors.enrollmentDate = 'La fecha de inscripción es requerida para estudiantes';
      } else {
        const selectedDate = new Date(formData.enrollmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate > today) {
          newErrors.enrollmentDate = 'La fecha de inscripción no puede ser futura';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Función para manejar cambios en los inputs
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // Si cambia el discriminator, limpiar las fechas que no correspondan
      if (name === 'discriminator') {
        if (value === 'Instructor') {
          newData.enrollmentDate = '';
        } else if (value === 'Student') {
          newData.hireDate = '';
        }
      }

      return newData;
    });

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // Función para crear una nueva person
  const createPerson = useCallback(async () => {
    if (!validateForm(false)) { // false porque no es edición
      showToast.error('Por favor, corrija los errores en el formulario');
      return false;
    }

    try {
      setLoading(true);
      
      // Preparar datos para envío - NO incluir personId para creación
      const dataToSend = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        discriminator: formData.discriminator,
        hireDate: formData.discriminator === 'Instructor' && formData.hireDate 
          ? new Date(formData.hireDate).toISOString() 
          : null,
        enrollmentDate: formData.discriminator === 'Student' && formData.enrollmentDate 
          ? new Date(formData.enrollmentDate).toISOString() 
          : null
      };

      await crearPerson(dataToSend);
      showToast.success('Person creada exitosamente');
      
      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Error al crear person:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          error.message || 
                          'Ha ocurrido un error al crear la person';
      showToast.error(`Error: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, onSuccess]);

  // Función para actualizar una person existente
  const updatePerson = useCallback(async () => {
    if (!validateForm(true)) { // true porque es edición
      showToast.error('Por favor, corrija los errores en el formulario');
      return false;
    }

    try {
      setLoading(true);
      
      // Preparar datos para envío - incluir personId para actualización
      const dataToSend = {
        personId: parseInt(formData.personId),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        discriminator: formData.discriminator,
        hireDate: formData.discriminator === 'Instructor' && formData.hireDate 
          ? new Date(formData.hireDate).toISOString() 
          : null,
        enrollmentDate: formData.discriminator === 'Student' && formData.enrollmentDate 
          ? new Date(formData.enrollmentDate).toISOString() 
          : null
      };

      await actualizarPerson(dataToSend);
      showToast.success('Person actualizada exitosamente');
      
      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Error al actualizar person:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          error.message || 
                          'Ha ocurrido un error al actualizar la person';
      showToast.error(`Error: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, onSuccess]);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData({
      personId: '',
      firstName: '',
      lastName: '',
      discriminator: '',
      hireDate: '',
      enrollmentDate: ''
    });
    setErrors({});
  }, []);

  // Función para establecer datos del formulario (útil para edición)
  const setFormDataWithValidation = useCallback((data) => {
    if (data) {
      setFormData({
        personId: data.personId || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        discriminator: data.discriminator || '',
        hireDate: data.hireDate ? new Date(data.hireDate).toISOString().slice(0, 16) : '',
        enrollmentDate: data.enrollmentDate ? new Date(data.enrollmentDate).toISOString().slice(0, 16) : ''
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
    createPerson,
    updatePerson,
    resetForm,
    validateForm
  };
};

export default usePersonForm;