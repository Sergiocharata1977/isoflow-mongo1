import { executeQuery } from '../lib/tursoClient';
import * as cacheService from '../lib/cacheService';

// Clave de caché para documentos
const DOCUMENTOS_CACHE_KEY = 'documentos';
const CATEGORIAS_CACHE_KEY = 'categorias_documentos';

// Datos de muestra para documentos (se usarán si no hay datos en la base de datos)
const MOCK_DOCUMENTOS = [
  {
    id: 1,
    codigo: 'SGC-P-001',
    titulo: 'Procedimiento de Control de Documentos',
    descripcion: 'Establece los lineamientos para la creación, revisión, aprobación y control de documentos del SGC.',
    categoria_id: 1,
    categoria_nombre: 'Procedimientos',
    proceso_id: 1,
    proceso_nombre: 'Gestión de Calidad',
    version: '1.0',
    fecha_publicacion: '2025-01-15',
    autor: 'Juan Pérez',
    estado: 'Vigente',
    url_documento: 'https://example.com/docs/sgc-p-001.pdf',
    tags: 'documentos,control,calidad',
    created_at: '2025-01-10',
    updated_at: '2025-01-15'
  },
  {
    id: 2,
    codigo: 'SGC-P-002',
    titulo: 'Procedimiento de Auditorías Internas',
    descripcion: 'Define la metodología para planificar y ejecutar auditorías internas del sistema de gestión de calidad.',
    categoria_id: 1,
    categoria_nombre: 'Procedimientos',
    proceso_id: 2,
    proceso_nombre: 'Mejora Continua',
    version: '1.1',
    fecha_publicacion: '2025-02-20',
    autor: 'María López',
    estado: 'Vigente',
    url_documento: 'https://example.com/docs/sgc-p-002.pdf',
    tags: 'auditoría,mejora,calidad',
    created_at: '2025-01-20',
    updated_at: '2025-02-20'
  },
  {
    id: 3,
    codigo: 'SGC-M-001',
    titulo: 'Manual de Calidad',
    descripcion: 'Documento principal que describe el sistema de gestión de calidad de la organización.',
    categoria_id: 2,
    categoria_nombre: 'Manuales',
    proceso_id: 1,
    proceso_nombre: 'Gestión de Calidad',
    version: '2.0',
    fecha_publicacion: '2025-03-10',
    autor: 'Carlos Rodríguez',
    estado: 'Vigente',
    url_documento: 'https://example.com/docs/sgc-m-001.pdf',
    tags: 'manual,calidad,sistema',
    created_at: '2024-12-15',
    updated_at: '2025-03-10'
  },
  {
    id: 4,
    codigo: 'SGC-F-001',
    titulo: 'Formato de Registro de No Conformidades',
    descripcion: 'Formato para documentar las no conformidades detectadas en el sistema de gestión.',
    categoria_id: 3,
    categoria_nombre: 'Formatos',
    proceso_id: 2,
    proceso_nombre: 'Mejora Continua',
    version: '1.0',
    fecha_publicacion: '2025-01-30',
    autor: 'Ana Martínez',
    estado: 'Vigente',
    url_documento: 'https://example.com/docs/sgc-f-001.pdf',
    tags: 'formato,no conformidad,registro',
    created_at: '2025-01-25',
    updated_at: '2025-01-30'
  },
  {
    id: 5,
    codigo: 'SGC-I-001',
    titulo: 'Instructivo de Calibración de Equipos',
    descripcion: 'Detalla el proceso para la calibración de equipos de medición utilizados en los procesos productivos.',
    categoria_id: 4,
    categoria_nombre: 'Instructivos',
    proceso_id: 3,
    proceso_nombre: 'Producción',
    version: '1.2',
    fecha_publicacion: '2025-04-05',
    autor: 'Roberto Sánchez',
    estado: 'En revisión',
    url_documento: 'https://example.com/docs/sgc-i-001.pdf',
    tags: 'calibración,equipos,medición',
    created_at: '2025-02-10',
    updated_at: '2025-04-01'
  }
];

// Datos de muestra para categorías
const MOCK_CATEGORIAS = [
  { id: 1, nombre: 'Procedimientos', descripcion: 'Documentos que describen procesos del SGC' },
  { id: 2, nombre: 'Manuales', descripcion: 'Documentos principales del SGC' },
  { id: 3, nombre: 'Formatos', descripcion: 'Plantillas para registros del SGC' },
  { id: 4, nombre: 'Instructivos', descripcion: 'Guías detalladas para actividades específicas' },
  { id: 5, nombre: 'Registros', descripcion: 'Evidencias documentadas del SGC' }
];

/**
 * Obtiene todos los documentos con información de categoría
 * @returns {Promise<Array>} Lista de documentos
 */
export async function getAllDocumentos() {
  // Intentar obtener de caché primero
  const cachedData = cacheService.get(DOCUMENTOS_CACHE_KEY);
  if (cachedData) {
    console.log('Obteniendo documentos desde caché');
    return cachedData;
  }

  try {
    console.log('Obteniendo documentos desde la base de datos');
    const query = `
      SELECT d.*, c.nombre as categoria_nombre, p.nombre as proceso_nombre
      FROM documentos d
      LEFT JOIN categorias_documentos c ON d.categoria_id = c.id
      LEFT JOIN procesos p ON d.proceso_id = p.id
      ORDER BY d.titulo
    `;
    const result = await executeQuery(query);
    
    if (result.error) {
      console.error('Error al obtener documentos:', result.error);
      console.log('Usando datos de muestra para documentos');
      // Guardar en caché los datos de muestra
      cacheService.set(DOCUMENTOS_CACHE_KEY, MOCK_DOCUMENTOS, 300); // 5 minutos
      return MOCK_DOCUMENTOS;
    }
    
    // Si no hay documentos en la base de datos, usar datos de muestra
    if (!result.data.rows || result.data.rows.length === 0) {
      console.log('No hay documentos en la base de datos, usando datos de muestra');
      // Guardar en caché los datos de muestra
      cacheService.set(DOCUMENTOS_CACHE_KEY, MOCK_DOCUMENTOS, 300); // 5 minutos
      return MOCK_DOCUMENTOS;
    }
    
    // Guardar en caché
    cacheService.set(DOCUMENTOS_CACHE_KEY, result.data.rows, 300); // 5 minutos
    
    return result.data.rows;
  } catch (error) {
    console.error('Error en getAllDocumentos:', error);
    console.log('Usando datos de muestra para documentos debido a error');
    // En caso de error, devolver datos de muestra
    return MOCK_DOCUMENTOS;
  }
}

/**
 * Obtiene un documento por su ID
 * @param {number} id ID del documento
 * @returns {Promise<Object>} Documento
 */
export async function getDocumentoById(id) {
  try {
    const query = `
      SELECT d.*, c.nombre as categoria_nombre, p.nombre as proceso_nombre
      FROM documentos d
      LEFT JOIN categorias_documentos c ON d.categoria_id = c.id
      LEFT JOIN procesos p ON d.proceso_id = p.id
      WHERE d.id = ?
    `;
    const result = await executeQuery(query, [id]);
    
    if (result.error) {
      console.error('Error al obtener documento:', result.error);
      // Buscar en los datos de muestra
      const mockDocumento = MOCK_DOCUMENTOS.find(doc => doc.id === parseInt(id));
      if (mockDocumento) {
        return mockDocumento;
      }
      throw new Error('Error al obtener documento');
    }
    
    // Si no se encuentra el documento en la base de datos, buscar en los datos de muestra
    if (!result.data.rows || result.data.rows.length === 0) {
      const mockDocumento = MOCK_DOCUMENTOS.find(doc => doc.id === parseInt(id));
      if (mockDocumento) {
        return mockDocumento;
      }
      return null;
    }
    
    return result.data.rows[0];
  } catch (error) {
    console.error('Error en getDocumentoById:', error);
    // Buscar en los datos de muestra
    const mockDocumento = MOCK_DOCUMENTOS.find(doc => doc.id === parseInt(id));
    if (mockDocumento) {
      return mockDocumento;
    }
    throw error;
  }
}

/**
 * Obtiene todas las categorías de documentos
 * @returns {Promise<Array>} Lista de categorías
 */
export async function getAllCategorias() {
  // Intentar obtener de caché primero
  const cachedData = cacheService.get(CATEGORIAS_CACHE_KEY);
  if (cachedData) {
    console.log('Obteniendo categorías desde caché');
    return cachedData;
  }

  try {
    console.log('Obteniendo categorías desde la base de datos');
    const query = `SELECT * FROM categorias_documentos ORDER BY nombre`;
    const result = await executeQuery(query);
    
    if (result.error) {
      console.error('Error al obtener categorías:', result.error);
      console.log('Usando datos de muestra para categorías');
      // Guardar en caché los datos de muestra
      cacheService.set(CATEGORIAS_CACHE_KEY, MOCK_CATEGORIAS, 600); // 10 minutos
      return MOCK_CATEGORIAS;
    }
    
    // Si no hay categorías en la base de datos, usar datos de muestra
    if (!result.data.rows || result.data.rows.length === 0) {
      console.log('No hay categorías en la base de datos, usando datos de muestra');
      // Guardar en caché los datos de muestra
      cacheService.set(CATEGORIAS_CACHE_KEY, MOCK_CATEGORIAS, 600); // 10 minutos
      return MOCK_CATEGORIAS;
    }
    
    // Guardar en caché
    cacheService.set(CATEGORIAS_CACHE_KEY, result.data.rows, 600); // 10 minutos
    
    return result.data.rows;
  } catch (error) {
    console.error('Error en getAllCategorias:', error);
    console.log('Usando datos de muestra para categorías debido a error');
    // En caso de error, devolver datos de muestra
    return MOCK_CATEGORIAS;
  }
}

/**
 * Crea un nuevo documento
 * @param {Object} documento Datos del documento
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function createDocumento(documento) {
  try {
    const query = `
      INSERT INTO documentos (
        titulo, descripcion, categoria_id, proceso_id, version, 
        fecha_publicacion, estado, url_documento, autor, codigo, tags,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      documento.titulo,
      documento.descripcion || '',
      documento.categoria_id,
      documento.proceso_id || null,
      documento.version,
      documento.fecha_publicacion,
      documento.estado,
      documento.url_documento || '',
      documento.autor || '',
      documento.codigo || '',
      documento.tags || '',
      documento.created_at,
      documento.updated_at
    ];
    
    const result = await executeQuery(query, params);
    
    if (result.error) {
      console.error('Error al crear documento:', result.error);
      throw new Error('Error al crear documento');
    }
    
    // Invalidar caché
    cacheService.remove(DOCUMENTOS_CACHE_KEY);
    
    return result.data;
  } catch (error) {
    console.error('Error en createDocumento:', error);
    throw error;
  }
}

/**
 * Actualiza un documento existente
 * @param {number} id ID del documento
 * @param {Object} documento Datos actualizados
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function updateDocumento(id, documento) {
  try {
    const query = `
      UPDATE documentos
      SET titulo = ?, descripcion = ?, categoria_id = ?, proceso_id = ?,
          version = ?, fecha_publicacion = ?, estado = ?, 
          url_documento = ?, autor = ?, codigo = ?, tags = ?, updated_at = ?
      WHERE id = ?
    `;
    
    const params = [
      documento.titulo,
      documento.descripcion || '',
      documento.categoria_id,
      documento.proceso_id || null,
      documento.version,
      documento.fecha_publicacion,
      documento.estado,
      documento.url_documento || '',
      documento.autor || '',
      documento.codigo || '',
      documento.tags || '',
      documento.updated_at,
      id
    ];
    
    const result = await executeQuery(query, params);
    
    if (result.error) {
      console.error('Error al actualizar documento:', result.error);
      throw new Error('Error al actualizar documento');
    }
    
    // Invalidar caché
    cacheService.remove(DOCUMENTOS_CACHE_KEY);
    
    return result.data;
  } catch (error) {
    console.error('Error en updateDocumento:', error);
    throw error;
  }
}

/**
 * Elimina un documento
 * @param {number} id ID del documento
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function deleteDocumento(id) {
  try {
    const query = `DELETE FROM documentos WHERE id = ?`;
    const result = await executeQuery(query, [id]);
    
    if (result.error) {
      console.error('Error al eliminar documento:', result.error);
      throw new Error('Error al eliminar documento');
    }
    
    // Invalidar caché
    cacheService.remove(DOCUMENTOS_CACHE_KEY);
    
    return result.data;
  } catch (error) {
    console.error('Error en deleteDocumento:', error);
    throw error;
  }
}

/**
 * Busca documentos por término
 * @param {string} term Término de búsqueda
 * @returns {Promise<Array>} Documentos encontrados
 */
export async function searchDocumentos(term) {
  try {
    const query = `
      SELECT d.*, c.nombre as categoria_nombre, p.nombre as proceso_nombre
      FROM documentos d
      LEFT JOIN categorias_documentos c ON d.categoria_id = c.id
      LEFT JOIN procesos p ON d.proceso_id = p.id
      WHERE d.titulo LIKE ? OR d.descripcion LIKE ? OR d.codigo LIKE ?
      ORDER BY d.titulo
    `;
    
    const searchTerm = `%${term}%`;
    const result = await executeQuery(query, [searchTerm, searchTerm, searchTerm]);
    
    if (result.error) {
      console.error('Error al buscar documentos:', result.error);
      // Buscar en los datos de muestra
      const filteredMockDocs = MOCK_DOCUMENTOS.filter(doc => 
        doc.titulo.toLowerCase().includes(term.toLowerCase()) || 
        (doc.descripcion && doc.descripcion.toLowerCase().includes(term.toLowerCase())) ||
        (doc.codigo && doc.codigo.toLowerCase().includes(term.toLowerCase()))
      );
      return filteredMockDocs;
    }
    
    return result.data.rows;
  } catch (error) {
    console.error('Error en searchDocumentos:', error);
    // Buscar en los datos de muestra
    const filteredMockDocs = MOCK_DOCUMENTOS.filter(doc => 
      doc.titulo.toLowerCase().includes(term.toLowerCase()) || 
      (doc.descripcion && doc.descripcion.toLowerCase().includes(term.toLowerCase())) ||
      (doc.codigo && doc.codigo.toLowerCase().includes(term.toLowerCase()))
    );
    return filteredMockDocs;
  }
}

// Exportar todas las funciones
const documentosService = {
  getAllDocumentos,
  getDocumentoById,
  getAllCategorias,
  createDocumento,
  updateDocumento,
  deleteDocumento,
  searchDocumentos
};

export default documentosService;
