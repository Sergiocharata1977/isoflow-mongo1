// Datos simulados para reemplazar la funcionalidad de Supabase
// Este archivo proporciona datos de ejemplo y funciones simuladas para todas las operaciones CRUD

// Función para generar un ID único
const generateId = () => Math.floor(Math.random() * 10000);

// Función para simular un retraso de red
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Función para crear un servicio CRUD genérico
export const createMockService = (initialData = []) => {
  let data = [...initialData];
  
  return {
    // Obtener todos los registros
    async getAll() {
      await delay();
      return { data, error: null };
    },
    
    // Crear un nuevo registro
    async create(item) {
      await delay();
      const newItem = { ...item, id: generateId(), created_at: new Date().toISOString() };
      data.push(newItem);
      return { data: newItem, error: null };
    },
    
    // Actualizar un registro existente
    async update(id, updates) {
      await delay();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) {
        return { data: null, error: { message: 'Registro no encontrado' } };
      }
      
      data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() };
      return { data: data[index], error: null };
    },
    
    // Eliminar un registro
    async delete(id) {
      await delay();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) {
        return { error: { message: 'Registro no encontrado' } };
      }
      
      data = data.filter(item => item.id !== id);
      return { error: null };
    }
  };
};

// Datos de ejemplo para cada entidad
export const mockUsuarios = [
  { id: 1, nombre: 'Admin', email: 'admin@example.com', rol: 'admin', created_at: '2025-01-01T00:00:00Z' },
  { id: 2, nombre: 'Usuario', email: 'usuario@example.com', rol: 'usuario', created_at: '2025-01-02T00:00:00Z' }
];

export const mockNoticias = [
  { 
    id: 1, 
    titulo: 'Certificación ISO 9001', 
    contenido: 'Estamos trabajando para obtener la certificación ISO 9001', 
    autor: 'Admin', 
    fecha: '2025-04-01T00:00:00Z',
    imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'
  },
  { 
    id: 2, 
    titulo: 'Nueva política de calidad', 
    contenido: 'Se ha actualizado la política de calidad de la empresa', 
    autor: 'Admin', 
    fecha: '2025-04-10T00:00:00Z',
    imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978'
  }
];

export const mockMejoras = [
  { 
    id: 1, 
    titulo: 'Optimización de procesos', 
    descripcion: 'Mejora en los tiempos de producción', 
    estado: 'En progreso', 
    responsable: 'Juan Pérez',
    fecha_inicio: '2025-03-15T00:00:00Z',
    fecha_fin_estimada: '2025-05-15T00:00:00Z'
  },
  { 
    id: 2, 
    titulo: 'Reducción de desperdicios', 
    descripcion: 'Implementación de programa de reciclaje', 
    estado: 'Planificado', 
    responsable: 'María García',
    fecha_inicio: '2025-04-01T00:00:00Z',
    fecha_fin_estimada: '2025-06-01T00:00:00Z'
  }
];

export const mockProcesos = [
  { 
    id: 1, 
    nombre: 'Gestión de Producción', 
    codigo: 'PRO-001', 
    version: '1.0', 
    responsable: 'Juan Pérez',
    descripcion: 'Proceso para gestionar la producción'
  },
  { 
    id: 2, 
    nombre: 'Control de Calidad', 
    codigo: 'PRO-002', 
    version: '1.1', 
    responsable: 'María García',
    descripcion: 'Proceso para controlar la calidad de los productos'
  }
];

export const mockIndicadores = [
  { 
    id: 1, 
    nombre: 'Eficiencia de producción', 
    descripcion: 'Mide la eficiencia del proceso productivo', 
    formula: '(Producción real / Producción planificada) * 100', 
    unidad: '%',
    meta: 95,
    proceso_id: 1
  },
  { 
    id: 2, 
    nombre: 'Tasa de defectos', 
    descripcion: 'Mide la cantidad de productos defectuosos', 
    formula: '(Productos defectuosos / Total de productos) * 100', 
    unidad: '%',
    meta: 2,
    proceso_id: 2
  }
];

// Exportar servicios simulados
export const mockServices = {
  usuarios: createMockService(mockUsuarios),
  noticias: createMockService(mockNoticias),
  mejoras: createMockService(mockMejoras),
  procesos: createMockService(mockProcesos),
  indicadores: createMockService(mockIndicadores),
  objetivos: createMockService([]),
  mediciones: createMockService([]),
  encuestas: createMockService([]),
  tickets: createMockService([]),
  silos: createMockService([]),
  puntosNorma: createMockService([])
};
