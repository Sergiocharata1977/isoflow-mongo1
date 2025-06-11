
import { supabase } from '@/lib/supabase';

export const medicionesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('mediciones')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(medicion) {
    const { data, error } = await supabase
      .from('mediciones')
      .insert([medicion])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, medicion) {
    const { data, error } = await supabase
      .from('mediciones')
      .update(medicion)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('mediciones')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
