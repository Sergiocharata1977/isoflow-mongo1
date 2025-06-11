// Servicio para gestionar mejoras con MongoDB
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const mejorasService = {
  // Obtener todas las mejoras
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/mejoras`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mejoras:', error);
      throw error;
    }
  },

  // Obtener una mejora por ID
  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/mejoras/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener mejora ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva mejora
  async create(mejora) {
    try {
      const response = await axios.post(`${API_URL}/mejoras`, mejora);
      return response.data;
    } catch (error) {
      console.error('Error al crear mejora:', error);
      throw error;
    }
  },

  // Actualizar una mejora existente
  async update(id, mejora) {
    try {
      const response = await axios.put(`${API_URL}/mejoras/${id}`, mejora);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar mejora ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una mejora
  async delete(id) {
    try {
      const response = await axios.delete(`${API_URL}/mejoras/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar mejora ${id}:`, error);
      throw error;
    }
  },

  // Obtener mejoras por estado
  async getByEstado(estado) {
    try {
      const response = await axios.get(`${API_URL}/mejoras/estado/${estado}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener mejoras por estado ${estado}:`, error);
      throw error;
    }
  },

  // Obtener mejoras por departamento
  async getByDepartamento(departamentoId) {
    try {
      const response = await axios.get(`${API_URL}/mejoras/departamento/${departamentoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener mejoras del departamento ${departamentoId}:`, error);
      throw error;
    }
  },

  // Obtener mejoras por usuario
  async getByUsuario(usuarioId) {
    try {
      const response = await axios.get(`${API_URL}/mejoras/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener mejoras del usuario ${usuarioId}:`, error);
      throw error;
    }
  },

  // Obtener mejoras por tipo
  async getByTipo(tipo) {
    try {
      const response = await axios.get(`${API_URL}/mejoras/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener mejoras por tipo ${tipo}:`, error);
      throw error;
    }
  },

  // Obtener mejoras por prioridad
  async getByPrioridad(prioridad) {
    try {
      const response = await axios.get(`${API_URL}/mejoras/prioridad/${prioridad}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener mejoras por prioridad ${prioridad}:`, error);
      throw error;
    }
  },

  // Agregar comentario a una mejora
  async addComentario(id, comentario) {
    try {
      const response = await axios.post(`${API_URL}/mejoras/${id}/comentarios`, comentario);
      return response.data;
    } catch (error) {
      console.error(`Error al agregar comentario a la mejora ${id}:`, error);
      throw error;
    }
  },

  // Obtener comentarios de una mejora
  async getComentarios(id) {
    try {
      const response = await axios.get(`${API_URL}/mejoras/${id}/comentarios`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener comentarios de la mejora ${id}:`, error);
      throw error;
    }
  },

  // Cambiar estado de una mejora
  async changeEstado(id, estado) {
    try {
      const response = await axios.put(`${API_URL}/mejoras/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar estado de la mejora ${id}:`, error);
      throw error;
    }
  },

  // Asignar mejora a un usuario
  async assignToUser(id, usuarioId) {
    try {
      const response = await axios.put(`${API_URL}/mejoras/${id}/assign`, { usuarioId });
      return response.data;
    } catch (error) {
      console.error(`Error al asignar mejora ${id} al usuario ${usuarioId}:`, error);
      throw error;
    }
  },

  // Subir documento de mejora
  async uploadDocumento(id, file) {
    try {
      const formData = new FormData();
      formData.append('documento', file);
      const response = await axios.post(`${API_URL}/mejoras/${id}/documento`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al subir documento para mejora ${id}:`, error);
      throw error;
    }
  },

  // Descargar documento de mejora
  async downloadDocumento(id) {
    try {
      const response = await axios.get(`${API_URL}/mejoras/${id}/documento`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error al descargar documento de mejora ${id}:`, error);
      throw error;
    }
  }
}; 