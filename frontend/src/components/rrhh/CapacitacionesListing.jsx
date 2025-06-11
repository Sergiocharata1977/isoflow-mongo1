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
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [capacitacionToDelete, setCapacitacionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [capacitaciones, setCapacitaciones] = useState([]);

  // Datos de ejemplo para usar si no hay datos o la conexión falla
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
      objetivos: "Comprender los conceptos básicos de la norma ISO 9001:2015\\nIdentificar los requisitos principales del SGC\\nEntender el enfoque basado en procesos y riesgos",
      contenido: "1. Introducción a los sistemas de gestión de calidad\\n2. Estructura de alto nivel\\n3. Enfoque basado en procesos\\n4. Pensamiento basado en riesgos\\n5. Requisitos de la norma ISO 9001:2015\\n6. Documentación del SGC",
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
      objetivos: "Formar auditores internos competentes\\nDesarrollar habilidades para planificar y ejecutar auditorías\\nAprender a redactar no conformidades y oportunidades de mejora",
      contenido: "1. Introducción a las auditorías de sistemas de gestión\\n2. Norma ISO 19011:2018\\n3. Planificación y preparación de auditorías\\n4. Técnicas de auditoría\\n5. Hallazgos de auditoría\\n6. Redacción del informe\\n7. Seguimiento de acciones correctivas",
      participantes: [
        { nombre: "María González", departamento: "Calidad" },
        { nombre: "Javier Pérez", departamento: "Producción" },
        { nombre: "Ana Torres", departamento: "Recursos Humanos" }
      ],
      evaluacion: "Examen teórico y práctica de auditoría"
    }
  ];

  useEffect(() => {
    fetchCapacitaciones();
  }, []);

  const fetchCapacitaciones = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM capacitaciones ORDER BY fecha_inicio DESC',
        args: {}
      });
      if (result.rows.length > 0) {
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
        cargarDatosLocales(true); // Forzar uso de muestra si DB está vacía
      }
    } catch (err) {
      console.error("Error al cargar capacitaciones desde Turso:", err);
      setError("Error al conectar con la base de datos. Mostrando datos locales.");
      cargarDatosLocales();
    } finally {
      setIsLoading(false);
    }
  };

  const cargarDatosLocales = (forceSample = false) => {
    try {
      const localData = localStorage.getItem("capacitaciones");
      if (localData && !forceSample) {
        setCapacitaciones(JSON.parse(localData));
      } else {
        setCapacitaciones(capacitacionesMuestra);
        localStorage.setItem("capacitaciones", JSON.stringify(capacitacionesMuestra));
      }
    } catch (error) {
      console.error("Error al cargar datos locales:", error);
      setCapacitaciones(capacitacionesMuestra); // Fallback a muestra en caso de error de parseo
    }
  };

  const insertCapacitacionToDb = async (capacitacion) => {
    try {
      const result = await client.execute({
        sql: `INSERT INTO capacitaciones (codigo, titulo, descripcion, instructor, departamento, duracion, fecha_inicio, fecha_fin, horario, lugar, modalidad, estado, cupo_maximo, objetivos, contenido, participantes, evaluacion) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
        args: [
          capacitacion.codigo,
          capacitacion.titulo,
          capacitacion.descripcion,
          capacitacion.instructor,
          capacitacion.departamento,
          capacitacion.duracion,
          capacitacion.fechaInicio,
          capacitacion.fechaFin,
          capacitacion.horario,
          capacitacion.lugar,
          capacitacion.modalidad,
          capacitacion.estado,
          capacitacion.cupoMaximo,
          capacitacion.objetivos,
          capacitacion.contenido,
          JSON.stringify(capacitacion.participantes || []),
          capacitacion.evaluacion
        ]
      });
      return result.rows[0].id;
    } catch (err) {
      console.error("Error al insertar en Turso:", err);
      throw err; // Re-lanzar para manejo en handleSave
    }
  };

  const handleSave = async (capacitacionData) => {
    setIsLoading(true);
    try {
      if (selectedCapacitacion) {
        // Editar capacitación existente
        const updatedCapacitacion = { ...selectedCapacitacion, ...capacitacionData };
        try {
          await client.execute({
            sql: `UPDATE capacitaciones SET
                  codigo = ?, titulo = ?, descripcion = ?, instructor = ?, 
                  departamento = ?, duracion = ?, fecha_inicio = ?, fecha_fin = ?, 
                  horario = ?, lugar = ?, modalidad = ?, estado = ?, cupo_maximo = ?, 
                  objetivos = ?, contenido = ?, participantes = ?, evaluacion = ?
                  WHERE id = ?`,
            args: [
              updatedCapacitacion.codigo, updatedCapacitacion.titulo, updatedCapacitacion.descripcion, updatedCapacitacion.instructor,
              updatedCapacitacion.departamento, updatedCapacitacion.duracion, updatedCapacitacion.fechaInicio, updatedCapacitacion.fechaFin,
              updatedCapacitacion.horario, updatedCapacitacion.lugar, updatedCapacitacion.modalidad, updatedCapacitacion.estado, updatedCapacitacion.cupoMaximo,
              updatedCapacitacion.objetivos, updatedCapacitacion.contenido, JSON.stringify(updatedCapacitacion.participantes || []), updatedCapacitacion.evaluacion,
              updatedCapacitacion.id
            ]
          });
          const newCapacitaciones = capacitaciones.map(c => c.id === updatedCapacitacion.id ? updatedCapacitacion : c);
          setCapacitaciones(newCapacitaciones);
          localStorage.setItem("capacitaciones", JSON.stringify(newCapacitaciones));
          toast({ title: "Capacitación actualizada", description: `La capacitación ${updatedCapacitacion.titulo} ha sido actualizada.` });
        } catch (err) {
          console.error("Error al actualizar en Turso:", err);
          setError("Error al actualizar en DB. Cambios guardados localmente.");
          // Actualizar localmente de todas formas
          const newCapacitaciones = capacitaciones.map(c => c.id === updatedCapacitacion.id ? updatedCapacitacion : c);
          setCapacitaciones(newCapacitaciones);
          localStorage.setItem("capacitaciones", JSON.stringify(newCapacitaciones));
          toast({ title: "Error de DB", description: "Actualización guardada localmente.", variant: "destructive" });
        }
      } else {
        // Crear nueva capacitación
        let newCapacitacion = { ...capacitacionData, id: Date.now() }; // ID temporal
        try {
          const newId = await insertCapacitacionToDb(newCapacitacion);
          newCapacitacion.id = newId; // Actualizar con el ID real de la base de datos
          const newCapacitaciones = [...capacitaciones, newCapacitacion];
          setCapacitaciones(newCapacitaciones);
          localStorage.setItem("capacitaciones", JSON.stringify(newCapacitaciones));
          toast({ title: "Capacitación creada", description: `La capacitación ${newCapacitacion.titulo} ha sido creada.` });
        } catch (err) {
          console.error("Error al insertar en Turso:", err);
          setError("Error al guardar en DB. Capacitación guardada localmente.");
          // Guardar localmente de todas formas
          const newCapacitaciones = [...capacitaciones, newCapacitacion]; // usa ID temporal
          setCapacitaciones(newCapacitaciones);
          localStorage.setItem("capacitaciones", JSON.stringify(newCapacitaciones));
          toast({ title: "Error de DB", description: "Capacitación guardada localmente.", variant: "destructive" });
        }
      }
      setIsModalOpen(false);
      setSelectedCapacitacion(null);
    } catch (generalError) {
      console.error("Error general en handleSave:", generalError);
      toast({ title: "Error", description: "Ocurrió un error inesperado.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const capToDelete = capacitaciones.find(c => c.id === id);
    setCapacitacionToDelete(capToDelete);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!capacitacionToDelete) return;
    setIsLoading(true);
    try {
      await client.execute({ sql: 'DELETE FROM capacitaciones WHERE id = ?', args: [capacitacionToDelete.id] });
      const newCapacitaciones = capacitaciones.filter(c => c.id !== capacitacionToDelete.id);
      setCapacitaciones(newCapacitaciones);
      localStorage.setItem("capacitaciones", JSON.stringify(newCapacitaciones));
      toast({ title: "Capacitación eliminada", description: `La capacitación ${capacitacionToDelete.titulo} ha sido eliminada.` });
    } catch (err) {
      console.error("Error al eliminar en Turso:", err);
      setError("Error al eliminar en DB. Eliminado localmente.");
      // Eliminar localmente de todas formas
      const newCapacitaciones = capacitaciones.filter(c => c.id !== capacitacionToDelete.id);
      setCapacitaciones(newCapacitaciones);
      localStorage.setItem("capacitaciones", JSON.stringify(newCapacitaciones));
      toast({ title: "Error de DB", description: "Eliminación efectuada localmente.", variant: "destructive" });
    }
    setCapacitacionToDelete(null);
    setDeleteDialogOpen(false);
    setIsLoading(false);
  };

  const handleViewCapacitacion = (capacitacion) => {
    setCurrentCapacitacion(capacitacion);
    setShowSingle(true);
  };

  const getEstadoBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "programada": return "bg-blue-100 text-blue-800";
      case "en curso": return "bg-yellow-100 text-yellow-800";
      case "finalizada": return "bg-green-100 text-green-800";
      case "cancelada": return "bg-red-100 text-red-800";
      case "planificada": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCapacitaciones = capacitaciones.filter(capacitacion =>
    capacitacion.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capacitacion.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capacitacion.departamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capacitacion.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const errorBanner = error ? (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-3" />
        <p>{error}</p>
      </div>
    </div>
  ) : null;

  if (isLoading && capacitaciones.length === 0 && !error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Cargando capacitaciones...</p>
      </div>
    );
  }

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
    <div className="p-4 md:p-6 space-y-6">
      {errorBanner}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card border rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="bg-background border border-input rounded-md p-1 flex items-center">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-state={viewMode === "grid" ? "active" : "inactive"}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0 rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-state={viewMode === "list" ? "active" : "inactive"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar capacitación..."
            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Content Area */}
      <motion.div layout className="min-h-[400px]">
        {isLoading && capacitaciones.length > 0 && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex justify-center items-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapacitaciones.map((capacitacion) => (
              <motion.div
                key={capacitacion.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
                onClick={() => handleViewCapacitacion(capacitacion)}
              >
                <div className="p-5 flex-grow">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-lg mt-1">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight cursor-pointer hover:text-primary">{capacitacion.titulo}</h3>
                      <p className="text-xs text-muted-foreground">{capacitacion.codigo}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 h-[40px]">
                    {capacitacion.descripcion}
                  </p>
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" /> 
                      <span className="truncate" title={capacitacion.instructor}>{capacitacion.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" /> 
                      {capacitacion.fechaInicio} {capacitacion.fechaFin && ` - ${capacitacion.fechaFin}`}
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 px-5 py-3 border-t flex justify-between items-center">
                  <Badge className={`${getEstadoBadgeColor(capacitacion.estado)}`}>{capacitacion.estado}</Badge>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => { e.stopPropagation(); handleEdit(capacitacion); }}
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => { e.stopPropagation(); handleDelete(capacitacion.id); }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-card border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-sm">Capacitación</th>
                  <th className="text-left p-3 font-medium text-sm">Instructor</th>
                  <th className="text-left p-3 font-medium text-sm">Fecha Inicio</th>
                  <th className="text-left p-3 font-medium text-sm">Estado</th>
                  <th className="text-right p-3 font-medium text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCapacitaciones.map((capacitacion) => (
                  <motion.tr
                    key={capacitacion.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleViewCapacitacion(capacitacion)}
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium truncate max-w-xs" title={capacitacion.titulo}>{capacitacion.titulo}</p>
                          <p className="text-sm text-muted-foreground">{capacitacion.codigo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm truncate max-w-xs" title={capacitacion.instructor}>{capacitacion.instructor}</td>
                    <td className="p-3 text-sm">{capacitacion.fechaInicio}</td>
                    <td className="p-3">
                      <Badge className={`${getEstadoBadgeColor(capacitacion.estado)} capitalize`}>{capacitacion.estado}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => { e.stopPropagation(); handleEdit(capacitacion); }}
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => { e.stopPropagation(); handleDelete(capacitacion.id); }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filteredCapacitaciones.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-1">No hay capacitaciones</h3>
            <p className="text-muted-foreground">
              {searchTerm ? `No se encontraron capacitaciones para "${searchTerm}".` : 'Intenta crear una nueva capacitación.'}
            </p>
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
              Esta acción no se puede deshacer. Se eliminará permanentemente la capacitación "{capacitacionToDelete?.titulo}".
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
