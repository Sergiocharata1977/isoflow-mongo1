// Servicio para la conexión con la base de datos Turso
import { executeQuery } from '../lib/tursoClient.js';

// Función genérica para obtener todos los registros de una tabla
export async function getAll(tableName) {
  try {
    const query = `SELECT * FROM ${tableName}`;
    const result = await executeQuery(query);
    return result.data ? result.data.rows : [];
  } catch (error) {
    console.error(`Error al obtener registros de ${tableName}:`, error);
    throw error;
  }
}

// Función genérica para obtener un registro por ID
export async function getById(tableName, id) {
  try {
    const query = `SELECT * FROM ${tableName} WHERE id = ?`;
    const result = await executeQuery(query, [id]);
    return result.data && result.data.rows.length > 0 ? result.data.rows[0] : null;
  } catch (error) {
    console.error(`Error al obtener registro de ${tableName} con ID ${id}:`, error);
    throw error;
  }
}

// Función genérica para crear un nuevo registro
export async function create(tableName, data) {
  try {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const result = await executeQuery(query, values);
    
    return result.data ? result.data : null;
  } catch (error) {
    console.error(`Error al crear registro en ${tableName}:`, error);
    throw error;
  }
}

// Función genérica para actualizar un registro
export async function update(tableName, id, data) {
  try {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    
    const query = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    const result = await executeQuery(query, values);
    
    return result.data ? result.data : null;
  } catch (error) {
    console.error(`Error al actualizar registro en ${tableName} con ID ${id}:`, error);
    throw error;
  }
}

// Función genérica para eliminar un registro
export async function remove(tableName, id) {
  try {
    const query = `DELETE FROM ${tableName} WHERE id = ?`;
    const result = await executeQuery(query, [id]);
    
    return result.data ? result.data : null;
  } catch (error) {
    console.error(`Error al eliminar registro de ${tableName} con ID ${id}:`, error);
    throw error;
  }
}

// Función genérica para buscar registros con filtros
export async function search(tableName, filters = {}) {
  try {
    let query = `SELECT * FROM ${tableName}`;
    const values = [];
    
    if (Object.keys(filters).length > 0) {
      const whereClause = Object.keys(filters)
        .map(key => {
          if (filters[key] === null) return null;
          values.push(filters[key]);
          return `${key} = ?`;
        })
        .filter(Boolean)
        .join(' AND ');
      
      if (whereClause) {
        query += ` WHERE ${whereClause}`;
      }
    }
    
    const result = await executeQuery(query, values);
    return result.data ? result.data.rows : [];
  } catch (error) {
    console.error(`Error al buscar registros en ${tableName}:`, error);
    throw error;
  }
}

// Exportar todas las funciones
export default {
  getAll,
  getById,
  create,
  update,
  remove,
  search
};
