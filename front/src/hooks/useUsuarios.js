import { useState, useEffect, useCallback } from 'react';
import { ObtenerPacientes, ObtenerMedicos } from './useApi';
import { showToast } from '../components/ToastNotification';

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');

  // Función para cargar todos los usuarios (pacientes y médicos)
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener pacientes y médicos en paralelo
      const [pacientesRes, medicosRes] = await Promise.all([
        ObtenerPacientes(),
        ObtenerMedicos()
      ]);

      // Procesar pacientes
      const pacientes = pacientesRes.data?.Pacientes?.map(paciente => ({
        ...paciente.Usuario,
        IdPaciente: paciente.IdPaciente,
        TipoSangre: paciente.TipoSangre,
        Alergias: paciente.Alergias,
        CondicionesCronicas: paciente.CondicionesCronicas,
        Rol: paciente.Usuario.Rol
      })) || [];

      // Procesar médicos
      const medicos = medicosRes.data?.Medicos?.map(medico => ({
        ...medico.Usuario,
        IdMedico: medico.IdMedico,
        NumeroLicencia: medico.NumeroLicencia,
        Biografia: medico.Biografia,
        AnnosExperiencia: medico.AnnosExperiencia,
        CalificacionPromedio: medico.CalificacionPromedio,
        NumeroCalificaciones: medico.NumeroCalificaciones,
        Rol: medico.Usuario.Rol
      })) || [];

      // Combinar y ordenar
      const todosUsuarios = [...pacientes, ...medicos].sort((a, b) => 
        a.NumeroIdentificacion.localeCompare(b.NumeroIdentificacion)
      );

      setUsuarios(todosUsuarios);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Error al cargar la lista de usuarios';
      setError(errorMessage);
      showToast.error(`Error: ${errorMessage}`);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar usuarios al montar
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Abrir modal
  const handleOpenModal = useCallback((mode, usuario = null) => {
    setModalMode(mode);
    setUsuarioSeleccionado(usuario);
    setShowModal(true);
  }, []);

  // Cerrar modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalMode('view');
    setUsuarioSeleccionado(null);
  }, []);

  // Eliminar usuario
  const deleteUsuario = useCallback(async (usuario) => {
    if (!usuario) return false;
    
    try {
      setLoading(true);
      
      // Determinar el endpoint según el tipo de usuario
      const endpoint = usuario.Rol?.Nombre === 'Medico' ? 
        `api/Medico/Eliminar/${usuario.IdMedico}` : 
        `api/Paciente/Eliminar/${usuario.IdPaciente}`;
      
      //await eliminarUsuario(endpoint);
      
      // Actualizar lista local
      setUsuarios(prev => prev.filter(u => 
        (usuario.Rol?.Nombre === 'Medico' ? u.IdMedico !== usuario.IdMedico : u.IdPaciente !== usuario.IdPaciente)
      ));
      
      showToast.success('Usuario eliminado exitosamente');
      return true;
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Error al eliminar el usuario';
      showToast.error(`Error: ${errorMessage}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    usuarios,
    usuarioSeleccionado,
    loading,
    error,
    showModal,
    modalMode,
    fetchUsuarios,
    refreshUsuarios: fetchUsuarios,
    handleOpenModal,
    handleCloseModal,
    deleteUsuario
  };
};

export default useUsuarios;