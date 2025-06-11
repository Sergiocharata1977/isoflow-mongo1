
import { supabase } from '@/lib/supabase';

export const encuestasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('encuestas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(encuesta) {
    const { data, error } = await supabase
      .from('encuestas')
      .insert([encuesta])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, encuesta) {
    const { data, error } = await supabase
      .from('encuestas')
      .update(encuesta)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('encuestas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
