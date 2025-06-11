/**
 * Servicio de caché para almacenar temporalmente los datos y evitar consultas innecesarias a la base de datos
 */

// Objeto para almacenar los datos en caché
const cache = {};

// Tiempo de expiración de la caché en milisegundos (5 minutos por defecto)
const DEFAULT_EXPIRATION = 5 * 60 * 1000;

/**
 * Obtiene un valor de la caché
 * @param {string} key - Clave para identificar los datos
 * @returns {any|null} - Datos almacenados o null si no existen o han expirado
 */
export function get(key) {
  const cachedItem = cache[key];
  
  if (!cachedItem) {
    return null;
  }
  
  // Verificar si los datos han expirado
  if (Date.now() > cachedItem.expiration) {
    // Eliminar datos expirados
    delete cache[key];
    return null;
  }
  
  console.log(`[Cache] Obteniendo datos de caché para: ${key}`);
  return cachedItem.data;
}

/**
 * Almacena un valor en la caché
 * @param {string} key - Clave para identificar los datos
 * @param {any} data - Datos a almacenar
 * @param {number} [expiration] - Tiempo de expiración en milisegundos (opcional)
 */
export function set(key, data, expiration = DEFAULT_EXPIRATION) {
  console.log(`[Cache] Almacenando datos en caché para: ${key}`);
  
  cache[key] = {
    data,
    expiration: Date.now() + expiration
  };
}

/**
 * Elimina un valor de la caché
 * @param {string} key - Clave para identificar los datos
 */
export function remove(key) {
  console.log(`[Cache] Eliminando datos de caché para: ${key}`);
  delete cache[key];
}

/**
 * Elimina todos los valores de la caché
 */
export function clear() {
  console.log('[Cache] Limpiando toda la caché');
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
}

/**
 * Obtiene o establece un valor en la caché
 * @param {string} key - Clave para identificar los datos
 * @param {Function} fetchFunction - Función para obtener los datos si no están en caché
 * @param {number} [expiration] - Tiempo de expiración en milisegundos (opcional)
 * @returns {Promise<any>} - Datos almacenados o recuperados
 */
export async function getOrSet(key, fetchFunction, expiration = DEFAULT_EXPIRATION) {
  // Intentar obtener datos de la caché
  const cachedData = get(key);
  
  if (cachedData !== null) {
    return cachedData;
  }
  
  // Si no hay datos en caché, obtenerlos y almacenarlos
  console.log(`[Cache] Datos no encontrados en caché para: ${key}, obteniendo datos frescos`);
  try {
    const freshData = await fetchFunction();
    set(key, freshData, expiration);
    return freshData;
  } catch (error) {
    console.error(`[Cache] Error al obtener datos frescos para: ${key}`, error);
    throw error;
  }
}

// No exportamos por defecto, solo las funciones individuales
