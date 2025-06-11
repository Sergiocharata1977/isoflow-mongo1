// Servicio para gestionar eventos con MongoDB
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Exportar tanto como constante nombrada para compatibilidad con otros módulos
export const eventosService = {
  // Obtener todos los eventos
  async getEventos() {
    try {
      const response = await axios.get(`${API_URL}/eventos`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  },

  // Crear un nuevo evento
  async createEvento(eventoData) {
    try {
      const response = await axios.post(`${API_URL}/eventos`, eventoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  },

  // Actualizar un evento existente
  async updateEvento(id, eventoData) {
    try {
      const response = await axios.put(`${API_URL}/eventos/${id}`, eventoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw error;
    }
  },

  // Eliminar un evento
  async deleteEvento(id) {
    try {
      await axios.delete(`${API_URL}/eventos/${id}`);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  },

  // Obtener eventos por tipo
  async getEventosPorTipo(tipo) {
    try {
      const response = await axios.get(`${API_URL}/eventos/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos por tipo:', error);
      throw error;
    }
  },

  // Obtener eventos por mejora
  async getEventosPorMejora(mejora_id) {
    try {
      const response = await axios.get(`${API_URL}/eventos/mejora/${mejora_id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos por mejora:', error);
      throw error;
    }
  }
};

// Exportar como default para mantener compatibilidad con las importaciones actuales
export default eventosService;
