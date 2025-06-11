// Servicio para el módulo de Auditorías
// Migrado a MongoDB: Uso de API REST
import { API_BASE_URL } from '../config';

// Configuración base para las peticiones
const API_URL = `${API_BASE_URL}/api/auditorias`;

// Obtener todas las auditorías
export async function getAllAuditorias() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener las auditorías');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getAllAuditorias:', error);
    throw error;
  }
}

// Obtener una auditoría por ID
export async function getAuditoriaById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Auditoría no encontrada');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en getAuditoriaById (${id}):`, error);
    throw error;
  }
}

// Crear una nueva auditoría
export async function createAuditoria(data) {
  try {
    // Asegurarse de que se incluya la fecha de creación
    const auditoriaData = {
      ...data,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditoriaData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear la auditoría');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en createAuditoria:', error);
    throw error;
  }
}

// Actualizar una auditoría
export async function updateAuditoria(id, data) {
  try {
    // Incluir fecha de actualización
    const auditoriaData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditoriaData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar la auditoría');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en updateAuditoria (${id}):`, error);
    throw error;
  }
}

// Eliminar una auditoría
export async function deleteAuditoria(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al eliminar la auditoría');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en deleteAuditoria (${id}):`, error);
    throw error;
  }
}

// Buscar auditorías por filtros
export async function searchAuditorias(filters) {
  try {
    // Convertir filtros a query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`${API_URL}/search?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Error al buscar auditorías');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en searchAuditorias:', error);
    throw error;
  }
}

// Obtener todos los hallazgos de una auditoría
export async function getHallazgosByAuditoriaId(auditoriaId) {
  try {
    const response = await fetch(`${API_URL}/${auditoriaId}/hallazgos`);
    
    if (!response.ok) {
      console.error('Error al obtener hallazgos:', response.statusText);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getHallazgosByAuditoriaId:', error);
    return [];
  }
}

// Obtener un hallazgo por ID
export async function getHallazgoById(id) {
  try {
    const response = await fetch(`${API_URL}/hallazgos/${id}`);
    
    if (!response.ok) {
      console.error('Error al obtener hallazgo:', response.statusText);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getHallazgoById:', error);
    return null;
  }
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
