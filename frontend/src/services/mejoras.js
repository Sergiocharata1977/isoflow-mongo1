// Servicio para gestionar mejoras
import { mockServices } from '@/lib/mockData';

// Exportar el servicio de mejoras con datos simulados
export const mejorasService = {
  async getAll() {
    try {
      return await mockServices.mejoras.getAll();
    } catch (error) {
      console.error('Error al obtener mejoras:', error);
      return { data: [], error };
    }
  },

  async create(mejora) {
    try {
      return await mockServices.mejoras.create(mejora);
    } catch (error) {
      console.error('Error al crear mejora:', error);
      return { data: null, error };
    }
  },

  async update(id, updates) {
    try {
      return await mockServices.mejoras.update(id, updates);
    } catch (error) {
      console.error('Error al actualizar mejora:', error);
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      return await mockServices.mejoras.delete(id);
    } catch (error) {
      console.error('Error al eliminar mejora:', error);
      return { error };
    }
  }
};
