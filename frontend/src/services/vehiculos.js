
import { supabase } from '@/lib/supabase';

export const vehiculosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(vehiculo) {
    const { data, error } = await supabase
      .from('vehiculos')
      .insert([vehiculo])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, vehiculo) {
    const { data, error } = await supabase
      .from('vehiculos')
      .update(vehiculo)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('vehiculos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Recorridos
  async getRecorridos(vehiculoId) {
    const { data, error } = await supabase
      .from('recorridos_vehiculos')
      .select('*')
      .eq('vehiculo_id', vehiculoId)
      .order('fecha_programada', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createRecorrido(recorrido) {
    const { data, error } = await supabase
      .from('recorridos_vehiculos')
      .insert([recorrido])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateRecorrido(id, recorrido) {
    const { data, error } = await supabase
      .from('recorridos_vehiculos')
      .update(recorrido)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteRecorrido(id) {
    const { error } = await supabase
      .from('recorridos_vehiculos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Mantenimientos
  async getMantenimientos(vehiculoId) {
    const { data, error } = await supabase
      .from('mantenimientos_vehiculos')
      .select('*')
      .eq('vehiculo_id', vehiculoId)
      .order('fecha_programada', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createMantenimiento(mantenimiento) {
    const { data, error } = await supabase
      .from('mantenimientos_vehiculos')
      .insert([mantenimiento])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateMantenimiento(id, mantenimiento) {
    const { data, error } = await supabase
      .from('mantenimientos_vehiculos')
      .update(mantenimiento)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteMantenimiento(id) {
    const { error } = await supabase
      .from('mantenimientos_vehiculos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
