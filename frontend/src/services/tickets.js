
import { supabase } from '@/lib/supabase';

export const ticketsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(ticket) {
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticket])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, ticket) {
    const { data, error } = await supabase
      .from('tickets')
      .update(ticket)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
