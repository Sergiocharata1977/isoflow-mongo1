// Servicio para gestionar usuarios con Turso
import { executeQuery } from '@/lib/tursoClient';

// Exportar el servicio de usuarios con Turso
export const tursoUsuariosService = {
  async getAll() {
    try {
      const query = 'SELECT * FROM usuarios';
      return await executeQuery(query);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { data: [], error };
    }
  },

  async getById(id) {
    try {
      const query = 'SELECT * FROM usuarios WHERE id = ?';
      return await executeQuery(query, [id]);
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return { data: null, error };
    }
  },

  async create(usuario) {
    try {
      const { nombre, email, rol } = usuario;
      const query = 'INSERT INTO usuarios (nombre, email, rol, created_at) VALUES (?, ?, ?, ?) RETURNING *';
      const now = new Date().toISOString();
      return await executeQuery(query, [nombre, email, rol, now]);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return { data: null, error };
    }
  },

  async update(id, updates) {
    try {
      const { nombre, email, rol } = updates;
      const query = 'UPDATE usuarios SET nombre = ?, email = ?, rol = ?, updated_at = ? WHERE id = ? RETURNING *';
      const now = new Date().toISOString();
      return await executeQuery(query, [nombre, email, rol, now, id]);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { data: null, error };
    }
  },

  async delete(id) {
    try {
      const query = 'DELETE FROM usuarios WHERE id = ?';
      return await executeQuery(query, [id]);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return { error };
    }
  }
};
