// Servicio para gestionar tickets con MongoDB
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ticketsService = {
  // Obtener todos los tickets
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/tickets`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      throw error;
    }
  },

  // Obtener un ticket por ID
  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ticket ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo ticket
  async create(ticket) {
    try {
      const response = await axios.post(`${API_URL}/tickets`, ticket);
      return response.data;
    } catch (error) {
      console.error('Error al crear ticket:', error);
      throw error;
    }
  },

  // Actualizar un ticket existente
  async update(id, ticket) {
    try {
      const response = await axios.put(`${API_URL}/tickets/${id}`, ticket);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar ticket ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un ticket
  async delete(id) {
    try {
      const response = await axios.delete(`${API_URL}/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar ticket ${id}:`, error);
      throw error;
    }
  },

  // Obtener tickets por estado
  async getByEstado(estado) {
    try {
      const response = await axios.get(`${API_URL}/tickets/estado/${estado}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tickets por estado ${estado}:`, error);
      throw error;
    }
  },

  // Obtener tickets por usuario
  async getByUsuario(usuarioId) {
    try {
      const response = await axios.get(`${API_URL}/tickets/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tickets del usuario ${usuarioId}:`, error);
      throw error;
    }
  },

  // Obtener tickets por departamento
  async getByDepartamento(departamentoId) {
    try {
      const response = await axios.get(`${API_URL}/tickets/departamento/${departamentoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tickets del departamento ${departamentoId}:`, error);
      throw error;
    }
  },

  // Obtener tickets por prioridad
  async getByPrioridad(prioridad) {
    try {
      const response = await axios.get(`${API_URL}/tickets/prioridad/${prioridad}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tickets por prioridad ${prioridad}:`, error);
      throw error;
    }
  },

  // Obtener tickets por tipo
  async getByTipo(tipo) {
    try {
      const response = await axios.get(`${API_URL}/tickets/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tickets por tipo ${tipo}:`, error);
      throw error;
    }
  },

  // Agregar comentario a un ticket
  async addComentario(id, comentario) {
    try {
      const response = await axios.post(`${API_URL}/tickets/${id}/comentarios`, comentario);
      return response.data;
    } catch (error) {
      console.error(`Error al agregar comentario al ticket ${id}:`, error);
      throw error;
    }
  },

  // Obtener comentarios de un ticket
  async getComentarios(id) {
    try {
      const response = await axios.get(`${API_URL}/tickets/${id}/comentarios`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener comentarios del ticket ${id}:`, error);
      throw error;
    }
  },

  // Cambiar estado de un ticket
  async changeEstado(id, estado) {
    try {
      const response = await axios.put(`${API_URL}/tickets/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar estado del ticket ${id}:`, error);
      throw error;
    }
  },

  // Asignar ticket a un usuario
  async assignToUser(id, usuarioId) {
    try {
      const response = await axios.put(`${API_URL}/tickets/${id}/assign`, { usuarioId });
      return response.data;
    } catch (error) {
      console.error(`Error al asignar ticket ${id} al usuario ${usuarioId}:`, error);
      throw error;
    }
  }
}; 