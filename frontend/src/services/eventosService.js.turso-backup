import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://iso-muestra-104-sergiocharata1977.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ'
});

export const eventosService = {
  // Obtener todos los eventos
  async getEventos() {
    try {
      const result = await client.execute('SELECT * FROM eventos ORDER BY fecha_inicio');
      return result.rows;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  },

  // Crear un nuevo evento
  async createEvento({ titulo, descripcion, tipo, fecha_inicio, fecha_fin, mejora_id }) {
    try {
      const id = crypto.randomUUID();
      await client.execute({
        sql: 'INSERT INTO eventos (id, titulo, descripcion, tipo, fecha_inicio, fecha_fin, mejora_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [id, titulo, descripcion, tipo, fecha_inicio, fecha_fin, mejora_id]
      });
      return id;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  },

  // Actualizar un evento existente
  async updateEvento(id, { titulo, descripcion, tipo, fecha_inicio, fecha_fin, mejora_id }) {
    try {
      await client.execute({
        sql: 'UPDATE eventos SET titulo = ?, descripcion = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, mejora_id = ? WHERE id = ?',
        args: [titulo, descripcion, tipo, fecha_inicio, fecha_fin, mejora_id, id]
      });
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw error;
    }
  },

  // Eliminar un evento
  async deleteEvento(id) {
    try {
      await client.execute({
        sql: 'DELETE FROM eventos WHERE id = ?',
        args: [id]
      });
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  },

  // Obtener eventos por tipo
  async getEventosPorTipo(tipo) {
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM eventos WHERE tipo = ? ORDER BY fecha_inicio',
        args: [tipo]
      });
      return result.rows;
    } catch (error) {
      console.error('Error al obtener eventos por tipo:', error);
      throw error;
    }
  },

  // Obtener eventos por mejora
  async getEventosPorMejora(mejora_id) {
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM eventos WHERE mejora_id = ? ORDER BY fecha_inicio',
        args: [mejora_id]
      });
      return result.rows;
    } catch (error) {
      console.error('Error al obtener eventos por mejora:', error);
      throw error;
    }
  }
};
