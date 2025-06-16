import { useState, useEffect, useCallback } from 'react';
import { obtenerPersons, eliminarPerson } from './useApi';
import { showToast } from '../components/ToastNotification';

const usePersons = () => {
  const [persons, setPersons] = useState([]);
  // CORREGIDO: Cambiar de personSeleccionada a personSeleccionado para consistencia
  const [personSeleccionado, setPersonSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'delete'

  // Función para cargar la lista de persons
  const fetchPersons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await obtenerPersons();
      
      // Verificar si la respuesta tiene datos
      if (response.data) {
        // Si response.data es un array, usarlo directamente
        // Si tiene una propiedad que contiene el array, ajustar según la estructura de tu API
        const personsData = Array.isArray(response.data) ? response.data : response.data.persons || [];
        setPersons(personsData);
      } else {
        setPersons([]);
      }
    } catch (err) {
      console.error('Error al cargar persons:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.title || 
                          err.message || 
                          'Error al cargar la lista de persons';
      setError(errorMessage);
      showToast.error(`Error: ${errorMessage}`);
      setPersons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar persons al montar el componente
  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  // Función para abrir el modal
  const handleOpenModal = useCallback((mode, person = null) => {
    console.log('Opening modal with mode:', mode, 'and person:', person); // Debug
    setModalMode(mode);
    setPersonSeleccionado(person);
    setShowModal(true);
  }, []);

  // Función para cerrar el modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalMode('view');
    setPersonSeleccionado(null);
  }, []);

  // Función para eliminar una person
  const deletePerson = useCallback(async (personId) => {
    if (!personId) {
      showToast.error('ID de person no válido');
      return false;
    }
    try {
      setLoading(true);
      
      await eliminarPerson(personId);
      
      // Actualizar la lista local removiendo la person eliminada
      setPersons(prev => prev.filter(person => person.personId !== personId));
      
      showToast.success('Person eliminada exitosamente');
      
      return true;
    } catch (error) {
      console.error('Error al eliminar person:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          error.message || 
                          'Ha ocurrido un error al eliminar la person';
      showToast.error(`Error: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para refrescar la lista de persons
  const refreshPersons = useCallback(() => {
    fetchPersons();
  }, [fetchPersons]);

  // Función para buscar una person por ID
  const findPersonById = useCallback((personId) => {
    return persons.find(person => person.personId === personId);
  }, [persons]);

  // Función para agregar una nueva person a la lista local
  const addPersonToList = useCallback((newPerson) => {
    setPersons(prev => [...prev, newPerson]);
  }, []);

  // Función para actualizar una person en la lista local
  const updatePersonInList = useCallback((updatedPerson) => {
    setPersons(prev => 
      prev.map(person => 
        person.personId === updatedPerson.personId 
          ? { ...person, ...updatedPerson }
          : person
      )
    );
  }, []);

  // Función para obtener estadísticas básicas
  const getStatistics = useCallback(() => {
    if (!persons.length) {
      return {
        total: 0,
        instructors: 0,
        students: 0,
        instructorsPercentage: 0,
        studentsPercentage: 0
      };
    }

    const instructors = persons.filter(person => person.discriminator === 'Instructor').length;
    const students = persons.filter(person => person.discriminator === 'Student').length;
    const total = persons.length;
    
    return {
      total,
      instructors,
      students,
      instructorsPercentage: total > 0 ? ((instructors / total) * 100).toFixed(1) : 0,
      studentsPercentage: total > 0 ? ((students / total) * 100).toFixed(1) : 0
    };
  }, [persons]);

  return {
    // Estado
    persons,
    personSeleccionado, // CORREGIDO: Cambiado de personSeleccionada a personSeleccionado
    loading,
    error,
    showModal,
    modalMode,
    
    // Funciones de modal
    handleOpenModal,
    handleCloseModal,
    
    // Funciones CRUD
    deletePerson,
    refreshPersons,
    addPersonToList,
    updatePersonInList,
    
    // Funciones de utilidad
    findPersonById,
    getStatistics,
    
    // Función para recargar datos
    fetchPersons
  };
};

export default usePersons;