// Servicio para gestionar usuarios
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Exportar el servicio de usuarios con datos simulados
export const usuariosService = {
  // Obtener todos los usuarios
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuario ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo usuario
  async create(usuario) {
    try {
      const response = await axios.post(`${API_URL}/usuarios`, usuario);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  // Actualizar un usuario existente
  async update(id, usuario) {
    try {
      const response = await axios.put(`${API_URL}/usuarios/${id}`, usuario);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar usuario ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un usuario
  async delete(id) {
    try {
      const response = await axios.delete(`${API_URL}/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar usuario ${id}:`, error);
      throw error;
    }
  },

  // Obtener usuarios por departamento
  async getByDepartamento(departamentoId) {
    try {
      const response = await axios.get(`${API_URL}/usuarios/departamento/${departamentoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuarios del departamento ${departamentoId}:`, error);
      throw error;
    }
  },

  // Obtener usuarios por puesto
  async getByPuesto(puestoId) {
    try {
      const response = await axios.get(`${API_URL}/usuarios/puesto/${puestoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuarios del puesto ${puestoId}:`, error);
      throw error;
    }
  },

  // Obtener usuarios por rol
  async getByRol(rol) {
    try {
      const response = await axios.get(`${API_URL}/usuarios/rol/${rol}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuarios con rol ${rol}:`, error);
      throw error;
    }
  },

  // Cambiar contraseña
  async changePassword(id, passwordData) {
    try {
      const response = await axios.post(`${API_URL}/usuarios/${id}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar contraseña del usuario ${id}:`, error);
      throw error;
    }
  },

  // Actualizar permisos
  async updatePermisos(id, permisos) {
    try {
      const response = await axios.put(`${API_URL}/usuarios/${id}/permisos`, { permisos });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar permisos del usuario ${id}:`, error);
      throw error;
    }
  },

  // Subir foto de perfil
  async uploadFoto(id, file) {
    try {
      const formData = new FormData();
      formData.append('foto', file);
      const response = await axios.post(`${API_URL}/usuarios/${id}/foto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al subir foto del usuario ${id}:`, error);
      throw error;
    }
  },

  // Obtener foto de perfil
  async getFoto(id) {
    try {
      const response = await axios.get(`${API_URL}/usuarios/${id}/foto`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener foto del usuario ${id}:`, error);
      throw error;
    }
  }
};

// También exportamos como default para mantener compatibilidad
export default usuariosService;
