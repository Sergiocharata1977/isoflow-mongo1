import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  GraduationCap,
  Users,
  LayoutGrid,
  List,
  ChevronRight,
  Calendar,
  Clock,
  AlertCircle
} from "lucide-react";
import CapacitacionModal from "./CapacitacionModal";
import CapacitacionSingle from "./CapacitacionSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { createClient } from '@libsql/client';

// Configuración del cliente Turso
const client = createClient({
  url: "libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ"
});

function CapacitacionesListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentCapacitacion, setCurrentCapacitacion] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [capacitacionToDelete, setCapacitacionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [capacitaciones, setCapacitaciones] = useState([]);

  // Datos de ejemplo para usar si no hay datos
  const capacitacionesMuestra = [
    {
      id: 1,
      codigo: "CAP-2025-001",
      titulo: "Introducción a ISO 9001:2015",
      descripcion: "Capacitación básica sobre los requisitos y fundamentos de la norma ISO 9001:2015 para sistemas de gestión de calidad.",
      instructor: "Ana López",
      departamento: "Calidad",
      duracion: "16 horas",
      fechaInicio: "2025-05-15",
      fechaFin: "2025-05-16",
      horario: "09:00 - 17:00",
      lugar: "Sala de Capacitación A",
      modalidad: "Presencial",
      estado: "programada",
      cupoMaximo: 20,
      objetivos: "Comprender los conceptos básicos de la norma ISO 9001:2015\nIdentificar los requisitos principales del SGC\nEntender el enfoque basado en procesos y riesgos",
      contenido: "1. Introducción a los sistemas de gestión de calidad\n2. Estructura de alto nivel\n3. Enfoque basado en procesos\n4. Pensamiento basado en riesgos\n5. Requisitos de la norma ISO 9001:2015\n6. Documentación del SGC",
      participantes: [
        { nombre: "Carlos Martínez", departamento: "Dirección General" },
        { nombre: "Laura Sánchez", departamento: "Dirección General" },
        { nombre: "Jorge Gutiérrez", departamento: "Producción" }
      ],
      evaluacion: "Examen final y trabajo práctico"
    },
    {
      id: 2,
      codigo: "CAP-2025-002",
      titulo: "Auditorías Internas ISO 9001",
      descripcion: "Formación para auditores internos del sistema de gestión de calidad según ISO 9001:2015 e ISO 19011.",
      instructor: "Roberto Gómez",
      departamento: "Calidad",
      duracion: "24 horas",
      fechaInicio: "2025-06-10",
      fechaFin: "2025-06-12",
      horario: "09:00 - 17:00",
      lugar: "Sala de Capacitación B",
      modalidad: "Presencial",
      estado: "programada",
      cupoMaximo: 15,
      objetivos: "Formar auditores internos competentes\nDesarrollar habilidades para planificar y ejecutar auditorías\nAprender a redactar no conformidades y oportunidades de mejora",
      contenido: "1. Principios de auditoría\n2. Gestión de un programa de auditoría\n3. Realización de una auditoría\n4. Competencia y evaluación de auditores\n5. Ejercicios prácticos\n6. Redacción de hallazgos",
      participantes: [
        { nombre: "Ana López", departamento: "Calidad" },
        { nombre: "Martín Rodríguez", departamento: "Recursos Humanos" }
      ],
      evaluacion: "Examen teórico y auditoría práctica"
    },
    {
      id: 3,
      codigo: "CAP-2025-003",
      titulo: "Gestión de Indicadores",
      descripcion: "Taller práctico sobre definición, medición y análisis de indicadores para la mejora continua.",
      instructor: "Lucía Fernández",
      departamento: "Capacitación",
      duracion: "8 horas",
      fechaInicio: "2025-05-20",
      fechaFin: "2025-05-20",
      horario: "09:00 - 17:00",
      lugar: "Sala de Reuniones Principal",
      modalidad: "Presencial",
      estado: "completada",
      cupoMaximo: 25,
      objetivos: "Aprender a definir indicadores efectivos\nDesarrollar habilidades para el análisis de datos\nImplementar acciones basadas en resultados de indicadores",
      contenido: "1. Tipos de indicadores\n2. Definición de métricas\n3. Recolección de datos\n4. Análisis e interpretación\n5. Toma de decisiones basada en datos\n6. Ejercicios prácticos",
      participantes: [
        { nombre: "Carlos Martínez", departamento: "Dirección General" },
        { nombre: "Ana López", departamento: "Calidad" },
        { nombre: "Jorge Gutiérrez", departamento: "Producción" },
        { nombre: "Martín Rodríguez", departamento: "Recursos Humanos" }
      ],
      evaluacion: "Proyecto de implementación"
    },
    {
      id: 4,
      codigo: "CAP-2025-004",
      titulo: "Gestión del Cambio",
      descripcion: "Curso sobre metodologías y herramientas para gestionar eficazmente los cambios organizacionales.",
      instructor: "Diego Morales",
      departamento: "Selección",
      duracion: "16 horas",
      fechaInicio: "2025-07-05",
      fechaFin: "2025-07-06",
      horario: "09:00 - 17:00",
      lugar: "Virtual",
      modalidad: "Online",
      estado: "programada",
      cupoMaximo: 30,
      objetivos: "Comprender los fundamentos de la gestión del cambio\nDesarrollar estrategias para minimizar resistencias\nImplementar planes de comunicación efectivos",
      contenido: "1. Modelos de gestión del cambio\n2. Análisis de impacto\n3. Gestión de resistencias\n4. Comunicación efectiva\n5. Planes de implementación\n6. Seguimiento y evaluación",
      participantes: [],
      evaluacion: "Caso práctico y presentación"
    },
    {
      id: 5,
      codigo: "CAP-2025-005",
      titulo: "Liderazgo y Trabajo en Equipo",
      descripcion: "Taller vivencial para desarrollar habilidades de liderazgo y fomentar el trabajo en equipo efectivo.",
      instructor: "Carolina Pérez",
      departamento: "Recursos Humanos",
      duracion: "16 horas",
      fechaInicio: "2025-06-25",
      fechaFin: "2025-06-26",
      horario: "09:00 - 17:00",
      lugar: "Hotel Business Center",
      modalidad: "Presencial",
      estado: "programada",
      cupoMaximo: 20,
      objetivos: "Desarrollar habilidades de liderazgo efectivo\nFortalecer la cohesión de los equipos de trabajo\nMejorar la comunicación y resolución de conflictos",
      contenido: "1. Estilos de liderazgo\n2. Comunicación asertiva\n3. Dinámicas de equipo\n4. Resolución de conflictos\n5. Delegación efectiva\n6. Plan de acción personal",
      participantes: [
        { nombre: "Jorge Gutiérrez", departamento: "Producción" },
        { nombre: "María Torres", departamento: "Producción" }
      ],
      evaluacion: "Autoevaluación y evaluación 360°"
    }
  ];

  // Cargar datos desde Turso con fallback a localStorage
  useEffect(() => {
    const fetchCapacitaciones = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Intentar obtener datos de Turso
        const result = await client.execute({
          sql: 'SELECT * FROM capacitaciones',
          args: {}
        });
        
        if (result.rows.length > 0) {
          // Datos encontrados en la base de datos
          const capacitacionesData = result.rows.map(row => ({
            id: row.id,
            codigo: row.codigo || '',
            titulo: row.titulo || '',
            descripcion: row.descripcion || '',
            instructor: row.instructor || '',
            departamento: row.departamento || '',
            duracion: row.duracion || '',
            fechaInicio: row.fecha_inicio || '',
            fechaFin: row.fecha_fin || '',
            horario: row.horario || '',
            lugar: row.lugar || '',
            modalidad: row.modalidad || '',
            estado: row.estado || '',
            cupoMaximo: row.cupo_maximo || 0,
            objetivos: row.objetivos || '',
            contenido: row.contenido || '',
            participantes: JSON.parse(row.participantes || '[]'),
            evaluacion: row.evaluacion || ''
          }));
          
          setCapacitaciones(capacitacionesData);
          localStorage.setItem("capacitaciones", JSON.stringify(capacitacionesData));
        } else {
          // No hay datos en la base de datos
          cargarDatosLocales();
        }
      } catch (err) {
        console.error("Error al cargar capacitaciones desde Turso:", err);
        setError("Error al conectar con la base de datos. Usando datos locales.");
        cargarDatosLocales();
      } finally {
        setIsLoading(false);
      }
    };
    
    // Función auxiliar para cargar datos locales
    const cargarDatosLocales = () => {
      // Intentar cargar desde localStorage primero
      const savedData = localStorage.getItem("capacitaciones");
      if (savedData) {
        setCapacitaciones(JSON.parse(savedData));
        toast({
          title: "Datos locales cargados",
          description: "Se están usando datos almacenados localmente",
          variant: "warning"
        });
      } else {
        // Si no hay datos en localStorage, usar datos de muestra
        setCapacitaciones(capacitacionesMuestra);
        localStorage.setItem("capacitaciones", JSON.stringify(capacitacionesMuestra));
        toast({
          title: "Datos de muestra cargados",
          description: "Se han cargado capacitaciones de ejemplo",
          variant: "info"
        });
      }
    }
    
    fetchCapacitaciones();
  }, []);

  // Función auxiliar para insertar capacitación en la base de datos
  const insertCapacitacionToDb = async (capacitacion) => {
    try {
      // Convertir arrays/objetos a JSON para almacenar en la base de datos
      const participantesJSON = JSON.stringify(capacitacion.participantes || []);
      
      await client.execute({
        sql: `INSERT OR REPLACE INTO capacitaciones_rrhh 
              (id, codigo, titulo, descripcion, instructor, departamento, duracion, 
               fecha_inicio, fecha_fin, horario, lugar, modalidad, estado, 
               cupo_maximo, objetivos, contenido, participantes, evaluacion) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          capacitacion.id,
          capacitacion.codigo || "",
          capacitacion.titulo || "",
          capacitacion.descripcion || "",
          capacitacion.instructor || "",
          capacitacion.departamento || "",
          capacitacion.duracion || "",
          capacitacion.fechaInicio || "",
          capacitacion.fechaFin || "",
          capacitacion.horario || "",
          capacitacion.lugar || "",
          capacitacion.modalidad || "",
          capacitacion.estado || "",
          capacitacion.cupoMaximo || 0,
          capacitacion.objetivos || "",
          capacitacion.contenido || "",
          participantesJSON,
          capacitacion.evaluacion || ""
        ]
      });
      return true;
    } catch (err) {
      console.error("Error al insertar capacitación en la base de datos:", err);
      return false;
    }
  };

  const handleSave = async (capacitacionData) => {
    try {
      let updatedCapacitaciones;
      let actionType;
      let newCapacitacion;

      if (capacitacionData.id) {
        // Actualización
        actionType = "actualizada";
        updatedCapacitaciones = capacitaciones.map((item) =>
          item.id === capacitacionData.id ? capacitacionData : item
        );
        newCapacitacion = capacitacionData;
      } else {
        // Creación
        actionType = "creada";
        const newId = Math.max(0, ...capacitaciones.map((c) => c.id)) + 1;
        newCapacitacion = { ...capacitacionData, id: newId };
        updatedCapacitaciones = [...capacitaciones, newCapacitacion];
      }

      // Intentar guardar en la base de datos primero
      try {
        await insertCapacitacionToDb(newCapacitacion);
        
        // Si la operación en la base de datos es exitosa, actualizar el estado y localStorage
        setCapacitaciones(updatedCapacitaciones);
        localStorage.setItem("capacitaciones", JSON.stringify(updatedCapacitaciones));
        
        toast({
          title: "Éxito",
          description: `Capacitación ${actionType} correctamente`,
        });
        
        setIsModalOpen(false);
        setSelectedCapacitacion(null);
      } catch (dbError) {
        console.error("Error al guardar en la base de datos:", dbError);
        
        // Fallback a localStorage si falla la base de datos
        setCapacitaciones(updatedCapacitaciones);
        localStorage.setItem("capacitaciones", JSON.stringify(updatedCapacitaciones));
        
        toast({
          title: "Guardado con advertencia",
          description: `Capacitación ${actionType} en almacenamiento local. Error de conexión a la base de datos.`,
          variant: "destructive",
        });
        
        setIsModalOpen(false);
        setSelectedCapacitacion(null);
      }
    } catch (error) {
      console.error("Error al guardar capacitación:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la capacitación",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const capacitacion = capacitaciones.find((c) => c.id === id);
    setCapacitacionToDelete(capacitacion);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const id = capacitacionToDelete.id;
      
      // Intentar eliminar de la base de datos primero
      try {
        await client.execute({
          sql: "DELETE FROM capacitaciones_rrhh WHERE id = ?",
          args: [id]
        });
        
        // Si la operación en la base de datos es exitosa, actualizar el estado y localStorage
        const updatedCapacitaciones = capacitaciones.filter((c) => c.id !== id);
        setCapacitaciones(updatedCapacitaciones);
        localStorage.setItem("capacitaciones", JSON.stringify(updatedCapacitaciones));
        
        toast({
          title: "Éxito",
          description: "Capacitación eliminada correctamente",
        });
      } catch (dbError) {
        console.error("Error al eliminar de la base de datos:", dbError);
        
        // Fallback a localStorage si falla la base de datos
        const updatedCapacitaciones = capacitaciones.filter((c) => c.id !== id);
        setCapacitaciones(updatedCapacitaciones);
        localStorage.setItem("capacitaciones", JSON.stringify(updatedCapacitaciones));
        
        toast({
          title: "Eliminado con advertencia",
          description: "Capacitación eliminada del almacenamiento local. Error de conexión a la base de datos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al eliminar capacitación:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la capacitación",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCapacitacionToDelete(null);
    }
  };

  const handleViewCapacitacion = (capacitacion) => {
    setCurrentCapacitacion(capacitacion);
    setShowSingle(true);
  };

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'programada':
        return 'bg-blue-100 text-blue-800';
      case 'en curso':
        return 'bg-yellow-100 text-yellow-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCapacitaciones = capacitaciones.filter(capacitacion =>
    capacitacion.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  const errorBanner = error ? (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p>{error}</p>
      </div>
    </div>
  ) : null;

  if (showSingle) {
    return (
      <CapacitacionSingle
        capacitacion={currentCapacitacion}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Capacitaciones</h1>
        <Button onClick={() => {
          setSelectedCapacitacion(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Capacitación
        </Button>
      </div>
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="bg-background border border-input rounded-md p-1 flex items-center">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0 rounded-sm"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0 rounded-sm"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar capacitaciones..."
              className="pl-8 h-10 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full overflow-auto"
      >
        {errorBanner}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Capacitaciones</h1>
            <Button onClick={() => {
              setSelectedCapacitacion(null);
              setIsModalOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Capacitación
            </Button>
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleViewCapacitacion(capacitacion)}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{capacitacion.titulo}</h3>
                      <p className="text-xs text-muted-foreground">
                        {capacitacion.codigo}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {capacitacion.descripcion}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      {capacitacion.instructor}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getEstadoBadgeColor(capacitacion.estado)}`}>
                      {capacitacion.estado}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {capacitacion.fechaInicio}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center"
                    >
                      <span className="mr-1">Ver detalles</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/50 px-6 py-3 flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(capacitacion);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(capacitacion.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Capacitación</th>
                  <th className="text-left p-4">Instructor</th>
                  <th className="text-left p-4">Fecha</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCapacitaciones.map((capacitacion) => (
                  <motion.tr
                    key={capacitacion.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border cursor-pointer hover:bg-accent/50"
                    onClick={() => handleViewCapacitacion(capacitacion)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{capacitacion.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {capacitacion.codigo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{capacitacion.instructor}</td>
                    <td className="p-4">{capacitacion.fechaInicio}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getEstadoBadgeColor(capacitacion.estado)}`}>
                        {capacitacion.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(capacitacion);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(capacitacion.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredCapacitaciones.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay capacitaciones registradas. Haz clic en "Nueva Capacitación" para comenzar.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <CapacitacionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCapacitacion(null);
        }}
        onSave={handleSave}
        capacitacion={selectedCapacitacion}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la capacitación {capacitacionToDelete?.titulo}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CapacitacionesListing;
