// Servicio para el módulo de Personal
import { API_BASE_URL } from '../config';

// Configuración base para las peticiones
const API_URL = `${API_BASE_URL}/api/personal`;

/**
 * Obtiene todos los registros de personal
 * @returns {Promise<Array>} Lista de empleados
 */
export async function getAllPersonal() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener el personal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getAllPersonal:', error);
    throw error;
  }
}

/**
 * Obtiene un empleado por su ID
 * @param {string} id - ID del empleado
 * @returns {Promise<Object>} Datos del empleado
 */
export async function getPersonalById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Empleado no encontrado');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en getPersonalById (${id}):`, error);
    throw error;
  }
}

/**
 * Crea un nuevo empleado
 * @param {Object} data - Datos del empleado
 * @returns {Promise<Object>} Empleado creado
 */
export async function createPersonal(data) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear el empleado');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en createPersonal:', error);
    throw error;
  }
}

/**
 * Actualiza un empleado existente
 * @param {string} id - ID del empleado
 * @param {Object} data - Datos actualizados
 * @returns {Promise<Object>} Empleado actualizado
 */
export async function updatePersonal(id, data) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar el empleado');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en updatePersonal (${id}):`, error);
    throw error;
  }
}

/**
 * Elimina un empleado
 * @param {string} id - ID del empleado
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function deletePersonal(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar el empleado');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en deletePersonal (${id}):`, error);
    throw error;
  }
}

/**
 * Obtiene el personal por departamento
 * @param {string} departamentoId - ID del departamento
 * @returns {Promise<Array>} Lista de empleados del departamento
 */
export async function getPersonalPorDepartamento(departamentoId) {
  try {
    const response = await fetch(`${API_URL}/departamento/${departamentoId}`);
    if (!response.ok) {
      throw new Error('Error al obtener el personal por departamento');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getPersonalPorDepartamento:', error);
    throw error;
  }
}

/**
 * Busca empleados por término de búsqueda
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} Resultados de la búsqueda
 */
export async function searchPersonal(filters) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/search?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Error en la búsqueda de personal');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en searchPersonal:', error);
    throw error;
  }
}

// Servicios para puestos
const PUESTOS_URL = `${API_BASE_URL}/api/puestos`;

/**
 * Obtiene todos los puestos
 * @returns {Promise<Array>} Lista de puestos
 */
export async function getAllPuestos() {
  try {
    const response = await fetch(PUESTOS_URL);
    if (!response.ok) {
      throw new Error('Error al obtener los puestos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getAllPuestos:', error);
    throw error;
  }
}

/**
 * Obtiene un puesto por su ID
 * @param {string} id - ID del puesto
 * @returns {Promise<Object>} Datos del puesto
 */
export async function getPuestoById(id) {
  try {
    const response = await fetch(`${PUESTOS_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Puesto no encontrado');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en getPuestoById (${id}):`, error);
    throw error;
  }
}

// Exportar todas las funciones
export default {
  getAllPersonal,
  getPersonalById,
  createPersonal,
  updatePersonal,
  deletePersonal,
  getPersonalPorDepartamento,
  searchPersonal,
  getAllPuestos,
  getPuestoById
};
