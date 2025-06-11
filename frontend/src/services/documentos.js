
import { supabase } from '@/lib/supabase';

export const documentosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(documento) {
    const { data, error } = await supabase
      .from('documentos')
      .insert([documento])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, documento) {
    const { data, error } = await supabase
      .from('documentos')
      .update(documento)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('documentos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
