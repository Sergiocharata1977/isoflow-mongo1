
import { supabase } from '@/lib/supabase';

export const puntosNormaService = {
  async getAll() {
    const { data, error } = await supabase
      .from('puntos_norma')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(punto) {
    const { data, error } = await supabase
      .from('puntos_norma')
      .insert([punto])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, punto) {
    const { data, error } = await supabase
      .from('puntos_norma')
      .update(punto)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('puntos_norma')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
