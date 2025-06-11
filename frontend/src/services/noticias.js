// Servicio para gestionar noticias
import { mockServices } from '@/lib/mockData';

// Exportar el servicio de noticias con datos simulados
export const noticiasService = {
  async getAll() {
    try {
      return await mockServices.noticias.getAll();
    } catch (error) {
      console.error('Error al obtener noticias:', error);
      return { data: [], error };
    }
  },

  async create(noticia) {
    try {
      return await mockServices.noticias.create(noticia);
    } catch (error) {
      console.error('Error al crear noticia:', error);
      return { data: null, error };
    }
  },

  async update(id, updates) {
    try {
      return await mockServices.noticias.update(id, updates);
    } catch (error) {
      console.error('Error al actualizar noticia:', error);
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      return await mockServices.noticias.delete(id);
    } catch (error) {
      console.error('Error al eliminar noticia:', error);
      return { error };
    }
  }
};
