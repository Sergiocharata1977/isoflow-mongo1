
import { supabase } from '@/lib/supabase';

export const indicadoresService = {
  async getAll() {
    const { data, error } = await supabase
      .from('indicadores')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(indicador) {
    const { data, error } = await supabase
      .from('indicadores')
      .insert([indicador])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, indicador) {
    const { data, error } = await supabase
      .from('indicadores')
      .update(indicador)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('indicadores')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
