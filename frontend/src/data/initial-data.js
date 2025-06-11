
// Departamentos de ejemplo
const departamentos = [
  {
    id: 1,
    nombre: "Producción",
    responsable: "Juan Pérez",
    descripcion: "Departamento encargado de la producción",
    objetivos: "Optimizar procesos productivos",
    email: "produccion@empresa.com",
    telefono: "123-456-789",
    ubicacion: "Planta Principal",
    presupuesto: "500000",
    fechaCreacion: "2025-01-01",
    estado: "activo"
  },
  // ... otros departamentos
];

// Personal de ejemplo
const personal = [
  {
    id: 1,
    numero: "P202501-001",
    nombre: "Juan Pérez",
    puesto: "Gerente de Producción",
    departamento: "Producción",
    email: "juan.perez@empresa.com",
    telefono: "123-456-789",
    fechaIngreso: "2025-01-01",
    documentoIdentidad: "12345678",
    direccion: "Calle Principal 123"
  },
  // ... otro personal
];

// Puestos de ejemplo
const puestos = [
  {
    id: 1,
    nombre: "Gerente de Producción",
    codigo: "GP-001",
    departamento: "Producción",
    supervisor: "Director de Operaciones",
    nivel: "Gerencial",
    descripcion: "Responsable de la gestión de producción",
    estado: "activo"
  },
  // ... otros puestos
];

// Procesos de ejemplo
const procesos = [
  {
    id: 1,
    titulo: "Gestión de Producción",
    codigo: "PRO-001",
    version: "1.0",
    objetivo: "Gestionar eficientemente la producción",
    estado: "activo"
  },
  // ... otros procesos
];

// Auditorías de ejemplo
const auditorias = [
  {
    id: 1,
    numero: "A202501-001",
    fecha_programada: "2025-04-15",
    responsable: "María García",
    objetivo: "Evaluar el cumplimiento de los procesos de producción",
    procesos_evaluar: "Gestión de Producción",
    estado: "Planificada",
    puntos: [
      {
        punto_norma: "7.1 Recursos",
        calificacion: "Bueno",
        comentarios: "Se evidencia una gestión adecuada de recursos"
      },
      {
        punto_norma: "8.1 Planificación operacional",
        calificacion: "Muy Bueno",
        comentarios: "Excelente planificación y seguimiento"
      }
    ],
    comentarios_finales: "La auditoría se desarrolló satisfactoriamente"
  },
  {
    id: 2,
    numero: "A202501-002",
    fecha_programada: "2025-04-20",
    responsable: "Carlos Rodríguez",
    objetivo: "Verificar el sistema de gestión de calidad",
    procesos_evaluar: "Gestión de Calidad",
    estado: "Planificada",
    puntos: [
      {
        punto_norma: "4.1 Contexto de la organización",
        calificacion: "Bueno",
        comentarios: "Se mantiene actualizado el análisis del contexto"
      },
      {
        punto_norma: "4.2 Partes interesadas",
        calificacion: "Regular",
        comentarios: "Se requiere actualizar el análisis de partes interesadas"
      }
    ],
    comentarios_finales: "Se identificaron oportunidades de mejora"
  }
];

// Hallazgos de ejemplo
const hallazgos = [
  {
    id: 1,
    descripcion: "Falta de documentación en proceso de producción",
    proceso_involucrado: "Gestión de Producción",
    estado: "Hallazgo",
    fecha_deteccion: "2025-04-01"
  },
  // ... otros hallazgos
];

// Tickets de ejemplo
const tickets = [
  {
    id: 1,
    client: "Empresa A",
    problem: "Error en sistema de facturación",
    status: "Open",
    responsible: "Juan Pérez",
    final_comments: "En proceso de revisión",
    priority: "Alta",
    created_at: "2025-04-01",
    category: "Sistema",
    satisfaction: 4
  },
  // ... otros tickets
];

// Encuestas de ejemplo
const encuestas = [
  {
    id: 1,
    cliente: "Empresa A",
    producto: "Producto X",
    satisfaccion_general: "Muy Bueno",
    atencion_empresa: "Excelente servicio y atención",
    tiempo_entrega: "Dentro del plazo acordado",
    recomendaria_compra: true,
    fecha: "2025-04-01",
    categoria: "Productos",
    puntuacion: 5
  },
  // ... otras encuestas
];

export const initializeData = () => {
  const hasData = localStorage.getItem("dataInitialized");
  
  if (!hasData) {
    try {
      localStorage.setItem("departamentos", JSON.stringify(departamentos));
      localStorage.setItem("personal", JSON.stringify(personal));
      localStorage.setItem("puestos", JSON.stringify(puestos));
      localStorage.setItem("procesos", JSON.stringify(procesos));
      localStorage.setItem("auditorias", JSON.stringify(auditorias));
      localStorage.setItem("mejoras", JSON.stringify(hallazgos));
      localStorage.setItem("tickets", JSON.stringify(tickets));
      localStorage.setItem("encuestas", JSON.stringify(encuestas));
      
      localStorage.setItem("dataInitialized", "true");
      
      console.log("Datos inicializados correctamente");
    } catch (error) {
      console.error("Error al inicializar datos:", error);
      localStorage.clear();
      throw error;
    }
  }
};

export { departamentos, personal, puestos, procesos, auditorias, hallazgos, tickets, encuestas };
