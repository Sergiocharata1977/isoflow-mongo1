
import { supabase } from '@/lib/supabase';

export const objetivosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('objetivos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(objetivo) {
    const { data, error } = await supabase
      .from('objetivos')
      .insert([objetivo])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, objetivo) {
    const { data, error } = await supabase
      .from('objetivos')
      .update(objetivo)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('objetivos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
