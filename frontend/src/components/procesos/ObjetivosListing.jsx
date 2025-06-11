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
  Target,
  ArrowLeft,
  ChevronRight,
  Activity
} from "lucide-react";
import ObjetivoModal from "./ObjetivoModal";
import IndicadoresListing from "./IndicadoresListing";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

function ObjetivosListing({ procesoId, procesoNombre, onBack }) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIndicadores, setShowIndicadores] = useState(false);
  const [currentObjetivo, setCurrentObjetivo] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (procesoId) {
      loadObjetivos();
    }
  }, [procesoId]);

  const loadObjetivos = async () => {
    if (!procesoId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Cargar objetivos desde la API de MongoDB
      const url = `/api/objetivos-calidad?procesoId=${procesoId}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al cargar los objetivos');
      }
      
      const data = await response.json();
      setObjetivos(data);
    } catch (error) {
      console.error('Error al cargar objetivos:', error);
      setError('No se pudieron cargar los objetivos. Intente de nuevo más tarde.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los objetivos."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (objetivoData) => {
    try {
      const isEditing = !!selectedObjetivo;
      const endpoint = isEditing ? `/api/objetivos-calidad/${selectedObjetivo._id}` : '/api/objetivos-calidad';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Agregar proceso_id y proceso_nombre al objetivo
      const objetivoWithProceso = {
        ...objetivoData,
        procesoId: procesoId, // Usamos camelCase para coincidir con el backend
        proceso_nombre: procesoNombre
      };
      
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetivoWithProceso)
      });
      
      if (!response.ok) {
        throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} objetivo`);
      }
      
      const savedObjetivo = await response.json();
      
      // Actualizar el estado local con el nuevo objetivo
      if (isEditing) {
        setObjetivos(objetivos.map(obj => obj._id === savedObjetivo._id ? savedObjetivo : obj));
      } else {
        setObjetivos([...objetivos, savedObjetivo]);
      }
      
      setIsModalOpen(false);
      setSelectedObjetivo(null);
      
      toast({
        title: isEditing ? "Objetivo actualizado" : "Objetivo creado",
        description: isEditing 
          ? "Los datos del objetivo han sido actualizados exitosamente" 
          : "Se ha agregado un nuevo objetivo exitosamente"
      });
    } catch (error) {
      console.error("Error al guardar objetivo:", error);
      toast({
        title: "Error",
        description: `Ocurrió un error al ${selectedObjetivo ? 'actualizar' : 'crear'} el objetivo`,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (objetivo) => {
    setSelectedObjetivo(objetivo);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`/api/objetivos-calidad/${deleteId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el objetivo');
      }
      
      // Actualizar el estado local eliminando el objetivo
      setObjetivos(objetivos.filter(obj => obj._id !== deleteId));
      
      setShowDeleteAlert(false);
      setDeleteId(null);
      
      toast({
        title: "Objetivo eliminado",
        description: "El objetivo ha sido eliminado exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar objetivo:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el objetivo",
        variant: "destructive"
      });
    }
  };

  const handleViewIndicadores = (objetivo) => {
    setCurrentObjetivo(objetivo);
    setShowIndicadores(true);
  };

  const handleBackFromIndicadores = () => {
    setShowIndicadores(false);
    setCurrentObjetivo(null);
  };

  const filteredObjetivos = objetivos.filter(objetivo =>
    objetivo.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (objetivo.descripcion && objetivo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (objetivo.responsable && objetivo.responsable.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (showIndicadores && currentObjetivo) {
    return (
      <IndicadoresListing
        objetivoId={currentObjetivo._id}
        objetivoTitulo={currentObjetivo.titulo}
        procesoId={procesoId}
        procesoNombre={procesoNombre}
        onBack={handleBackFromIndicadores}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb y título */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Procesos
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{procesoNombre}</h2>
          <p className="text-muted-foreground">
            Objetivos del proceso
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar objetivos..."
              className="pl-8 h-10 w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            onClick={() => {
              setSelectedObjetivo(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Objetivo
          </Button>
        </div>
      </div>

      {/* Lista de Objetivos */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando objetivos...</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4">Objetivo</th>
                  <th className="text-left p-4">Descripción</th>
                  <th className="text-left p-4">Responsable</th>
                  <th className="text-left p-4">Meta</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredObjetivos.map((objetivo) => (
                  <motion.tr
                    key={objetivo._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewIndicadores(objetivo)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-primary" />
                        <div className="flex items-center">
                          <span className="font-medium">{objetivo.titulo}</span>
                          <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">{objetivo.descripcion}</p>
                    </td>
                    <td className="p-4">{objetivo.responsable}</td>
                    <td className="p-4">
                      <p className="text-sm">{objetivo.meta}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        objetivo.estado === "Completado" 
                          ? "bg-green-100 text-green-800"
                          : objetivo.estado === "En progreso"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {objetivo.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(objetivo);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(objetivo._id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewIndicadores(objetivo);
                        }}
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredObjetivos.length === 0 && (
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay objetivos registrados para este proceso. Haz clic en "Nuevo Objetivo" para comenzar.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este objetivo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El objetivo y todos sus datos serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal para crear/editar */}
      <ObjetivoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedObjetivo(null);
        }}
        onSave={handleSave}
        objetivo={selectedObjetivo}
        procesoId={procesoId}
        procesoNombre={procesoNombre}
      />
    </div>
  );
}

export default ObjetivosListing;