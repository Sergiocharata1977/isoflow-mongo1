// Servicio para el módulo de Auditorías
import tursoService from './tursoService.js';
import { executeQuery } from '../lib/tursoClient.js';

const AUDITORIAS_TABLE = 'auditorias';
const HALLAZGOS_TABLE = 'hallazgos_auditoria';

// Obtener todas las auditorías
export async function getAllAuditorias() {
  return tursoService.getAll(AUDITORIAS_TABLE);
}

// Obtener una auditoría por ID
export async function getAuditoriaById(id) {
  return tursoService.getById(AUDITORIAS_TABLE, id);
}

// Crear una nueva auditoría
export async function createAuditoria(data) {
  // Asegurarse de que se incluya la fecha de creación
  const auditoriaData = {
    ...data,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
  return tursoService.create(AUDITORIAS_TABLE, auditoriaData);
}

// Actualizar una auditoría
export async function updateAuditoria(id, data) {
  // Incluir fecha de actualización
  const auditoriaData = {
    ...data,
    updated_at: new Date().toISOString()
  };
  return tursoService.update(AUDITORIAS_TABLE, id, auditoriaData);
}

// Eliminar una auditoría
export async function deleteAuditoria(id) {
  return tursoService.remove(AUDITORIAS_TABLE, id);
}

// Buscar auditorías por filtros
export async function searchAuditorias(filters) {
  return tursoService.search(AUDITORIAS_TABLE, filters);
}

// Obtener todos los hallazgos de una auditoría
export async function getHallazgosByAuditoriaId(auditoriaId) {
  try {
    const query = `
      SELECT h.*, p.nombre as proceso_nombre
      FROM ${HALLAZGOS_TABLE} h
      LEFT JOIN procesos p ON h.proceso_id = p.id
      WHERE h.auditoria_id = ?
    `;
    const result = await executeQuery(query, [auditoriaId]);
    return result.data ? result.data.rows : [];
  } catch (error) {
    console.error(`Error al obtener hallazgos de la auditoría ${auditoriaId}:`, error);
    throw error;
  }
}

// Obtener un hallazgo por ID
export async function getHallazgoById(id) {
  return tursoService.getById(HALLAZGOS_TABLE, id);
}

// Crear un nuevo hallazgo
export async function createHallazgo(data) {
  // Asegurarse de que se incluya la fecha de creación
  const hallazgoData = {
    ...data,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
  return tursoService.create(HALLAZGOS_TABLE, hallazgoData);
}

// Actualizar un hallazgo
export async function updateHallazgo(id, data) {
  // Incluir fecha de actualización
  const hallazgoData = {
    ...data,
    updated_at: new Date().toISOString()
  };
  return tursoService.update(HALLAZGOS_TABLE, id, hallazgoData);
}

// Eliminar un hallazgo
export async function deleteHallazgo(id) {
  return tursoService.remove(HALLAZGOS_TABLE, id);
}

// Obtener resumen de auditorías por estado
export async function getResumenAuditoriasPorEstado() {
  try {
    const query = `
      SELECT estado, COUNT(*) as cantidad
      FROM ${AUDITORIAS_TABLE}
      GROUP BY estado
    `;
    const result = await executeQuery(query);
    return result.data ? result.data.rows : [];
  } catch (error) {
    console.error('Error al obtener resumen de auditorías por estado:', error);
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
  searchAuditorias,
  getHallazgosByAuditoriaId,
  getHallazgoById,
  createHallazgo,
  updateHallazgo,
  deleteHallazgo,
  getResumenAuditoriasPorEstado
};
