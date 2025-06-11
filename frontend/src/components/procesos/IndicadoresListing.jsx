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
  BarChart2,
  LayoutGrid,
  List,
  ChevronRight,
  ArrowLeft,
  LineChart
} from "lucide-react";
import IndicadorModal from "./IndicadorModal";
import MedicionesListing from "./MedicionesListing";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { createClient } from '@libsql/client';

const IndicadorCard = React.memo(({ indicador, onView, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
    onClick={() => onView(indicador)}
  >
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <BarChart2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-center">
          <h3 className="font-semibold truncate">{indicador.titulo}</h3>
          <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{indicador.descripcion}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{indicador.unidad_medida}</span>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(indicador);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(indicador.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
));

function IndicadoresListing({ objetivoId, objetivoTitulo, procesoId, procesoNombre, onBack }) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndicador, setSelectedIndicador] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [indicadorToDelete, setIndicadorToDelete] = useState(null);
  const [indicadores, setIndicadores] = useState([]);
  const [showMediciones, setShowMediciones] = useState(false);
  const [currentIndicador, setCurrentIndicador] = useState(null);

  // Cliente Turso
  const client = createClient({
    url: "libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ"
  });

  useEffect(() => {
    loadIndicadores();
  }, [objetivoId]);

  const loadIndicadores = async () => {
    try {
      setIsLoading(true);
      
      // Intentar cargar desde Turso primero
      try {
        const result = await client.execute({
          sql: 'SELECT * FROM indicadores WHERE objetivo_id = ?',
          args: [objetivoId]
        });
        
        if (result.rows.length > 0) {
          setIndicadores(result.rows);
          setIsLoading(false);
          return;
        }
      } catch (dbError) {
        console.log("Fallback a localStorage:", dbError);
      }
      
      // Intentar cargar desde localStorage
      const saved = localStorage.getItem("indicadores");
      let data = saved ? JSON.parse(saved) : [];
      
      // Filtrar por objetivo_id
      data = data.filter(indicador => indicador.objetivo_id === objetivoId);
      
      // Si no hay datos, crear datos de muestra
      if (data.length === 0) {
        data = [
          {
            id: 1,
            titulo: "Tiempo medio de producción",
            descripcion: "Mide el tiempo promedio que toma completar un ciclo de producción",
            unidad_medida: "Minutos",
            limite_aceptacion: "< 45 min",
            frecuencia_medicion: "Semanal",
            responsable: "Juan Pérez",
            objetivo_id: objetivoId,
            objetivo_titulo: objetivoTitulo,
            proceso_id: procesoId,
            formula: "Suma de tiempos / Número de ciclos"
          },
          {
            id: 2,
            titulo: "Tasa de defectos",
            descripcion: "Porcentaje de productos con defectos detectados en control de calidad",
            unidad_medida: "%",
            limite_aceptacion: "< 2%",
            frecuencia_medicion: "Diaria",
            responsable: "María López",
            objetivo_id: objetivoId,
            objetivo_titulo: objetivoTitulo,
            proceso_id: procesoId,
            formula: "(Productos defectuosos / Total de productos) * 100"
          }
        ];
        
        // Guardar datos de muestra en localStorage
        const allIndicadores = saved ? JSON.parse(saved) : [];
        const updatedIndicadores = [...allIndicadores, ...data];
        localStorage.setItem("indicadores", JSON.stringify(updatedIndicadores));
        
        // Intentar guardar los datos de muestra en Turso
        try {
          for (const indicador of data) {
            await saveIndicadorToTurso(indicador);
          }
        } catch (error) {
          console.error("Error saving sample data to Turso:", error);
        }
      }
      
      setIndicadores(data);
    } catch (error) {
      console.error("Error loading indicadores:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los indicadores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveIndicadorToTurso = async (indicador) => {
    try {
      // Verificar si el indicador ya existe
      const checkResult = await client.execute({
        sql: 'SELECT id FROM indicadores WHERE id = ?',
        args: [indicador.id]
      });

      if (checkResult.rows.length > 0) {
        // Actualizar
        await client.execute({
          sql: `UPDATE indicadores SET 
                titulo = ?, 
                descripcion = ?, 
                unidad_medida = ?, 
                limite_aceptacion = ?, 
                frecuencia_medicion = ?, 
                responsable = ?, 
                objetivo_id = ?, 
                objetivo_titulo = ?, 
                proceso_id = ?, 
                formula = ? 
                WHERE id = ?`,
          args: [
            indicador.titulo,
            indicador.descripcion,
            indicador.unidad_medida,
            indicador.limite_aceptacion,
            indicador.frecuencia_medicion,
            indicador.responsable,
            indicador.objetivo_id,
            indicador.objetivo_titulo,
            indicador.proceso_id,
            indicador.formula,
            indicador.id
          ]
        });
      } else {
        // Insertar
        await client.execute({
          sql: `INSERT INTO indicadores (
                id, 
                titulo, 
                descripcion, 
                unidad_medida, 
                limite_aceptacion, 
                frecuencia_medicion, 
                responsable, 
                objetivo_id, 
                objetivo_titulo, 
                proceso_id, 
                formula
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            indicador.id,
            indicador.titulo,
            indicador.descripcion,
            indicador.unidad_medida,
            indicador.limite_aceptacion,
            indicador.frecuencia_medicion,
            indicador.responsable,
            indicador.objetivo_id,
            indicador.objetivo_titulo,
            indicador.proceso_id,
            indicador.formula
          ]
        });
      }
      return true;
    } catch (error) {
      console.error("Error saving to Turso:", error);
      return false;
    }
  };

  const handleSave = async (indicadorData) => {
    try {
      setIsLoading(true);
      let updatedIndicadores;
      let savedIndicador;
      
      // Obtener todos los indicadores para actualizar localStorage
      const saved = localStorage.getItem("indicadores");
      const allIndicadores = saved ? JSON.parse(saved) : [];
      
      if (selectedIndicador) {
        savedIndicador = { 
          ...indicadorData, 
          id: selectedIndicador.id,
          objetivo_id: objetivoId,
          objetivo_titulo: objetivoTitulo,
          proceso_id: procesoId
        };
        
        // Actualizar el estado local
        updatedIndicadores = indicadores.map(i => 
          i.id === selectedIndicador.id ? savedIndicador : i
        );
        
        // Actualizar localStorage
        const updatedAllIndicadores = allIndicadores.map(i => 
          i.id === selectedIndicador.id ? savedIndicador : i
        );
        
        toast({
          title: "Indicador actualizado",
          description: "Los datos del indicador han sido actualizados exitosamente"
        });
        
        // Guardar en Turso
        const tursoSaved = await saveIndicadorToTurso(savedIndicador);
        if (!tursoSaved) {
          // Fallback a localStorage si falla Turso
          localStorage.setItem("indicadores", JSON.stringify(updatedAllIndicadores));
        }
      } else {
        savedIndicador = { 
          ...indicadorData, 
          id: Date.now(),
          objetivo_id: objetivoId,
          objetivo_titulo: objetivoTitulo,
          proceso_id: procesoId
        };
        
        // Actualizar el estado local
        updatedIndicadores = [...indicadores, savedIndicador];
        
        // Actualizar localStorage
        const updatedAllIndicadores = [...allIndicadores, savedIndicador];
        
        toast({
          title: "Indicador creado",
          description: "Se ha agregado un nuevo indicador exitosamente"
        });
        
        // Guardar en Turso
        const tursoSaved = await saveIndicadorToTurso(savedIndicador);
        if (!tursoSaved) {
          // Fallback a localStorage si falla Turso
          localStorage.setItem("indicadores", JSON.stringify(updatedAllIndicadores));
        }
      }
      
      setIndicadores(updatedIndicadores);
      setIsModalOpen(false);
      setSelectedIndicador(null);
    } catch (error) {
      console.error("Error saving indicador:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el indicador",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (indicador) => {
    setSelectedIndicador(indicador);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const indicador = indicadores.find(i => i.id === id);
    setIndicadorToDelete(indicador);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!indicadorToDelete) return;
    
    try {
      setIsLoading(true);
      
      // Intentar eliminar de Turso primero
      try {
        await client.execute({
          sql: 'DELETE FROM indicadores WHERE id = ?',
          args: [indicadorToDelete.id]
        });
      } catch (dbError) {
        console.log("Fallback a localStorage para eliminar:", dbError);
      }
      
      // Actualizar estado local
      const updatedIndicadores = indicadores.filter(i => i.id !== indicadorToDelete.id);
      setIndicadores(updatedIndicadores);
      
      // Actualizar localStorage
      const saved = localStorage.getItem("indicadores");
      const allIndicadores = saved ? JSON.parse(saved) : [];
      const updatedAllIndicadores = allIndicadores.filter(i => i.id !== indicadorToDelete.id);
      localStorage.setItem("indicadores", JSON.stringify(updatedAllIndicadores));
      
      toast({
        title: "Indicador eliminado",
        description: "El indicador ha sido eliminado exitosamente"
      });
      
      setDeleteDialogOpen(false);
      setIndicadorToDelete(null);
    } catch (error) {
      console.error("Error deleting indicador:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el indicador",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMediciones = (indicador) => {
    setCurrentIndicador(indicador);
    setShowMediciones(true);
  };

  const handleBackFromMediciones = () => {
    setShowMediciones(false);
    setCurrentIndicador(null);
  };

  // Si estamos viendo las mediciones de un indicador
  if (showMediciones && currentIndicador) {
    return (
      <MedicionesListing
        indicadorId={currentIndicador.id}
        indicadorTitulo={currentIndicador.titulo}
        unidadMedida={currentIndicador.unidad_medida}
        limiteAceptacion={currentIndicador.limite_aceptacion}
        onBack={handleBackFromMediciones}
      />
    );
  }

  // Filtrar indicadores según búsqueda
  const filteredIndicadores = indicadores.filter(indicador =>
    indicador.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indicador.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indicador.responsable?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Procesos
        </Button>
        <h2 className="text-xl font-semibold">
          Indicadores: {objetivoTitulo}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <motion.div layout className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar indicadores..."
                className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "secondary" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button onClick={() => {
                setSelectedIndicador(null);
                setIsModalOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Indicador
              </Button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIndicadores.map((indicador) => (
                <IndicadorCard
                  key={indicador.id}
                  indicador={indicador}
                  onView={handleViewMediciones}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              {filteredIndicadores.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    No hay indicadores registrados para este objetivo. Haz clic en "Nuevo Indicador" para comenzar.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="text-left p-4">Indicador</th>
                    <th className="text-left p-4">Descripción</th>
                    <th className="text-left p-4">Unidad</th>
                    <th className="text-left p-4">Límite</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndicadores.map((indicador) => (
                    <motion.tr
                      key={indicador.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border cursor-pointer hover:bg-accent/50"
                      onClick={() => handleViewMediciones(indicador)}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <BarChart2 className="h-5 w-5 text-primary" />
                          <div className="flex items-center">
                            <span className="font-medium">{indicador.titulo}</span>
                            <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm line-clamp-2">{indicador.descripcion}</p>
                      </td>
                      <td className="p-4">{indicador.unidad_medida}</td>
                      <td className="p-4">{indicador.limite_aceptacion}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(indicador);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(indicador.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMediciones(indicador);
                          }}
                        >
                          <LineChart className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredIndicadores.length === 0 && (
                <div className="text-center py-12">
                  <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    No hay indicadores registrados para este objetivo. Haz clic en "Nuevo Indicador" para comenzar.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Modals */}
      <IndicadorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIndicador(null);
        }}
        onSave={handleSave}
        indicador={selectedIndicador}
        objetivoId={objetivoId}
        objetivoTitulo={objetivoTitulo}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el indicador {indicadorToDelete?.titulo}.
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

export default IndicadoresListing;
