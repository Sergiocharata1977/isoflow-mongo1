
import { supabase } from '@/lib/supabase';

export const silosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('silos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(silo) {
    const { data, error } = await supabase
      .from('silos')
      .insert([silo])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, silo) {
    const { data, error } = await supabase
      .from('silos')
      .update(silo)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('silos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
