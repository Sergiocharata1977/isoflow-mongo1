// Servicio para gestionar usuarios con MongoDB
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Exportar el servicio de usuarios con Turso
export const usuariosService = {
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { data: [], error };
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/usuarios/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return { data: null, error };
    }
  },

  async create(usuario) {
    try {
      const response = await axios.post(`${API_URL}/usuarios`, usuario);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return { data: null, error };
    }
  },

  async update(id, updates) {
    try {
      const response = await axios.put(`${API_URL}/usuarios/${id}`, updates);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/usuarios/${id}`);
      return { error: null };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return { error };
    }
  }
};
