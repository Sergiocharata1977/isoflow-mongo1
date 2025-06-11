// Script para actualizar todos los servicios y eliminar referencias a Supabase
// Este archivo es solo para referencia y no se ejecuta directamente

/*
Plantilla para actualizar cada servicio:

// Servicio para gestionar [nombre]
import { mockServices } from '@/lib/mockData';

// Exportar el servicio de [nombre] con datos simulados
export const [nombre]Service = {
  async getAll() {
    try {
      return await mockServices.[nombre].getAll();
    } catch (error) {
      console.error('Error al obtener [nombre]:', error);
      return { data: [], error };
    }
  },

  async create(item) {
    try {
      return await mockServices.[nombre].create(item);
    } catch (error) {
      console.error('Error al crear [nombre]:', error);
      return { data: null, error };
    }
  },

  async update(id, updates) {
    try {
      return await mockServices.[nombre].update(id, updates);
    } catch (error) {
      console.error('Error al actualizar [nombre]:', error);
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      return await mockServices.[nombre].delete(id);
    } catch (error) {
      console.error('Error al eliminar [nombre]:', error);
      return { error };
    }
  }
};
*/
