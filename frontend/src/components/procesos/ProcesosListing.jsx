import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  FileText,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  ArrowLeft
} from "lucide-react";
import ProcesoModal from "./ProcesoModal";
import ObjetivosListing from "./ObjetivosListing";
import ProcesoSingle from "./ProcesoSingle";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";

// Componente de tarjeta de proceso
const ProcesoCard = React.memo(({ proceso, onView, onEdit, onDelete }) => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-card border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold truncate">{proceso.nombre}</h3>
              <p className="text-sm text-muted-foreground">{proceso.tipo}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{proceso.descripcion}</p>
          <p className="text-sm font-medium">Responsable: <span className="text-muted-foreground">{proceso.responsable || "No asignado"}</span></p>
          
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-blue-400" : "bg-blue-50 hover:bg-blue-100 border-blue-200"}
              onClick={(e) => {
                e.stopPropagation();
                onView(proceso);
              }}
            >
              <FileText className="h-4 w-4 mr-1 text-blue-600" />
              <span className="text-blue-600">Ver</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-green-400" : "bg-green-50 hover:bg-green-100 border-green-200"}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(proceso);
              }}
            >
              <Pencil className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-green-600">Editar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={isDark ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-red-400" : "bg-red-50 hover:bg-red-100 border-red-200"}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(proceso.id);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1 text-red-600" />
              <span className="text-red-600">Borrar</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function ProcesosListing() {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [view, setView] = useState('list'); // 'list', 'single', u 'objetivos'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [procesos, setProcesos] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [procesoToDelete, setProcesoToDelete] = useState(null);

  useEffect(() => {
    loadProcesos();
  }, []);

  const loadProcesos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/procesos');
      if (!response.ok) {
        throw new Error('Error al cargar los procesos');
      }
      const data = await response.json();
      setProcesos(data);
    } catch (error) {
      console.error("Error al cargar procesos:", error);
      setError("Error al cargar los procesos. Intenta de nuevo más tarde.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los procesos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (procesoData) => {
    try {
      setIsLoading(true);
      const currentId = procesoData.id;
      
      // Verificar si es edición o creación
      if (currentId) {
        // Edición
        const newProceso = { ...procesoData };
        newProceso.updated_at = new Date().toISOString();
        
        const newProcesos = procesos.map(p => 
          p.id === currentId ? newProceso : p
        );
        
        // Actualizar en MongoDB
        const response = await fetch(`/api/procesos/${newProceso.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProceso)
        });
        
        if (!response.ok) {
          throw new Error('Error al actualizar el proceso');
        }
        
        setProcesos(newProcesos);
        toast({
          title: "Proceso actualizado",
          description: `El proceso ${newProceso.nombre} ha sido actualizado correctamente.`,
        });
      } else {
        // Creación
        const newProceso = {
          ...procesoData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const newProcesos = [...procesos, newProceso];
        
        // Guardar en MongoDB
        const response = await fetch('/api/procesos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProceso)
        });
        
        if (!response.ok) {
          throw new Error('Error al crear el proceso');
        }
        
        setProcesos(newProcesos);
        toast({
          title: "Proceso creado",
          description: `El proceso ${newProceso.nombre} ha sido creado correctamente.`,
        });
      }
      
      setIsModalOpen(false);
      setSelectedProceso(null);
    } catch (error) {
      console.error("Error al guardar proceso:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el proceso. Intenta de nuevo más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (proceso) => {
    setSelectedProceso(proceso);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const proceso = procesos.find(p => p.id === id);
    setProcesoToDelete(proceso);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const id = procesoToDelete.id;
      
      // Eliminar de MongoDB
      const response = await fetch(`/api/procesos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el proceso');
      }
      
      const newProcesos = procesos.filter(p => p.id !== procesoToDelete.id);
      setProcesos(newProcesos);
      
      toast({
        title: "Proceso eliminado",
        description: `El proceso ${procesoToDelete.nombre} ha sido eliminado correctamente.`,
      });
      
      setDeleteDialogOpen(false);
      setProcesoToDelete(null);
    } catch (error) {
      console.error("Error al eliminar proceso:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el proceso. Intenta de nuevo más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (proceso) => {
    setSelectedProceso(proceso);
    setView('single');
  };

  const handleViewObjetivos = (proceso) => {
    setSelectedProceso(proceso);
    setView('objetivos');
  };

  // Filtrar procesos según el término de búsqueda
  const filteredProcesos = procesos.filter(proceso =>
    proceso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (view === 'single' && selectedProceso) {
    return (
      <ProcesoSingle 
        proceso={selectedProceso} 
        onBack={() => setView('list')}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        onViewObjetivos={handleViewObjetivos} // Pasamos la nueva función
      />
    );
  }

  if (view === 'objetivos' && selectedProceso) {
    return (
      <ObjetivosListing 
        procesoId={selectedProceso._id}
        procesoNombre={selectedProceso.nombre}
        onBack={() => setView('single')} // Volver a la vista de detalle del proceso
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Procesos</h2>
        <Button onClick={() => setIsModalOpen(true)} className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proceso
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar procesos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <p>Cargando procesos...</p>
            </motion.div>
          ) : filteredProcesos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col justify-center items-center h-64"
            >
              <p className="text-lg text-muted-foreground mb-2">No hay procesos disponibles.</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Crear proceso
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border rounded-md overflow-hidden mt-4"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium">Nombre</th>
                    <th className="text-left p-4 font-medium">Descripción</th>
                    <th className="text-left p-4 font-medium">Tipo</th>
                    <th className="text-left p-4 font-medium">Responsable</th>
                    <th className="text-right p-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredProcesos.map(proceso => (
                      <motion.tr
                        key={proceso.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-t hover:bg-muted/50 transition-colors"
                        onClick={() => handleViewDetails(proceso)}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <div className="flex items-center">
                              <span className="font-medium">{proceso.nombre}</span>
                              <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm line-clamp-2">{proceso.descripcion}</p>
                        </td>
                        <td className="p-4">{proceso.tipo}</td>
                        <td className="p-4">{proceso.responsable}</td>
                        <td className="p-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(proceso);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1 text-blue-600" />
                            <span className="text-blue-600">Ver</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 hover:bg-green-100 border-green-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(proceso);
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-green-600">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 border-red-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(proceso.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1 text-red-600" />
                            <span className="text-red-600">Borrar</span>
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal para crear/editar proceso */}
      <ProcesoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProceso(null);
        }}
        onSave={handleSave}
        proceso={selectedProceso}
      />

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el proceso {procesoToDelete?.nombre}.
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

    </motion.div>
  );
}

export default ProcesosListing;