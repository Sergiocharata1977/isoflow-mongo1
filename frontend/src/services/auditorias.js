// Servicio para el módulo de Auditorías
import { executeQuery } from '../lib/tursoClient.js';

const AUDITORIAS_TABLE = 'auditorias';
const HALLAZGOS_TABLE = 'hallazgos_auditoria';
const PUNTOS_TABLE = 'auditoria_puntos';

// Obtener todas las auditorías
export async function getAllAuditorias() {
  try {
    const query = `SELECT * FROM ${AUDITORIAS_TABLE} ORDER BY fecha_inicio DESC`;
    const result = await executeQuery(query);
    return result.data ? result.data.rows : [];
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    throw error;
  }
}

// Obtener una auditoría por ID
export async function getAuditoriaById(id) {
  try {
    const query = `SELECT * FROM ${AUDITORIAS_TABLE} WHERE id = ?`;
    const result = await executeQuery(query, [id]);
    return result.data && result.data.rows.length > 0 ? result.data.rows[0] : null;
  } catch (error) {
    console.error(`Error al obtener auditoría con ID ${id}:`, error);
    throw error;
  }
}

// Crear una nueva auditoría
export async function createAuditoria(data) {
  try {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const query = `INSERT INTO ${AUDITORIAS_TABLE} (${columns}) VALUES (${placeholders})`;
    const result = await executeQuery(query, values);
    
    // Obtener el ID de la auditoría recién creada
    const idQuery = 'SELECT last_insert_rowid() as id';
    const idResult = await executeQuery(idQuery);
    const newId = idResult.data.rows[0].id;
    
    // Obtener la auditoría recién creada
    return getAuditoriaById(newId);
  } catch (error) {
    console.error('Error al crear auditoría:', error);
    throw error;
  }
}

// Actualizar una auditoría
export async function updateAuditoria(id, data) {
  try {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    
    const query = `UPDATE ${AUDITORIAS_TABLE} SET ${setClause} WHERE id = ?`;
    const result = await executeQuery(query, values);
    
    return getAuditoriaById(id);
  } catch (error) {
    console.error(`Error al actualizar auditoría con ID ${id}:`, error);
    throw error;
  }
}

// Eliminar una auditoría
export async function deleteAuditoria(id) {
  try {
    // Primero eliminar los puntos evaluados
    const deletePuntosQuery = `DELETE FROM ${PUNTOS_TABLE} WHERE auditoria_id = ?`;
    await executeQuery(deletePuntosQuery, [id]);
    
    // Luego eliminar la auditoría
    const query = `DELETE FROM ${AUDITORIAS_TABLE} WHERE id = ?`;
    const result = await executeQuery(query, [id]);
    
    return result.data;
  } catch (error) {
    console.error(`Error al eliminar auditoría con ID ${id}:`, error);
    throw error;
  }
}

// Obtener todos los puntos evaluados de una auditoría
export async function getPuntosByAuditoriaId(auditoriaId) {
  try {
    const query = `SELECT * FROM ${PUNTOS_TABLE} WHERE auditoria_id = ?`;
    const result = await executeQuery(query, [auditoriaId]);
    return result.data ? result.data.rows : [];
  } catch (error) {
    console.error(`Error al obtener puntos de la auditoría ${auditoriaId}:`, error);
    throw error;
  }
}

// Crear un nuevo punto evaluado
export async function createPunto(data) {
  try {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const query = `INSERT INTO ${PUNTOS_TABLE} (${columns}) VALUES (${placeholders})`;
    const result = await executeQuery(query, values);
    
    return result.data;
  } catch (error) {
    console.error('Error al crear punto:', error);
    throw error;
  }
}

// Exportar todas las funciones
export default {
  getAllAuditorias,
  getAuditoriaById,
  createAuditoria,
  updateAuditoria,
  deleteAuditoria,
  getPuntosByAuditoriaId,
  createPunto
};
