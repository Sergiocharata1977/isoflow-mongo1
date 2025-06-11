import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { Skeleton } from "../../components/ui/skeleton";
import {
  LayoutGrid,
  List as ListIcon,
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";

// Servicios
import personalService from "../../services/personalService";

// Componentes
import PersonalModal from "./PersonalModal";
import PersonalSingle from "./PersonalSingle";
import PersonalCard from "./PersonalCard";
import PersonalTableView from "./PersonalTableView";

function PersonalListing() {
  console.log("PersonalListing se está renderizando");
  const { toast } = useToast();
  const [personal, setPersonal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showSingleView, setShowSingleView] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState(null);

  // Cargar datos del personal
  // Cargar datos del personal
  const fetchPersonal = useCallback(async () => {
    try {
      console.log("Iniciando fetchPersonal");
      setIsLoading(true);
      setError(null);
      const data = await personalService.getAllPersonal();
      console.log("Datos recibidos:", data);
      // Asegurarse de que data sea un array antes de hacer setPersonal
      if (Array.isArray(data)) {
        setPersonal(data);
      } else {
        console.warn('fetchPersonal recibió datos que no son un array:', data);
        setPersonal([]); // Establecer a array vacío si no es un array
        setError("Los datos recibidos del servidor no son válidos.");
      }
    } catch (err) {
      console.error("Error en fetchPersonal:", err);
      setError("No se pudieron cargar los datos del personal. Intente de nuevo más tarde.");
      // El toast ya se maneja en el componente que usa useToast, o se puede agregar aquí si es necesario
      // toast({
      //   title: "Error",
      //   description: err.message || "No se pudieron cargar los datos del personal.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencias vacías si personalService es estable y no hay otras dependencias externas

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    console.log("useEffect para fetchPersonal se está ejecutando");
    fetchPersonal();
  }, [fetchPersonal]); // fetchPersonal ahora tiene una identidad estable

  // Filtrar personal basado en el término de búsqueda
  const filteredPersonal = personal.filter((person) =>
    `${person.nombre || ''} ${person.apellido || ''} ${person.email || ''} ${person.telefono || ''} ${person.puesto?.nombre || ''} ${person.departamento?.nombre || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredPersonal.length / itemsPerPage));
  const paginatedPersonal = filteredPersonal.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Manejadores de eventos
  const handleAddNew = () => {
    setSelectedPerson(null);
    setIsModalOpen(true);
  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleView = (person) => {
    setCurrentPerson(person);
    setShowSingleView(true);
  };

  const handleDeleteClick = (person) => {
    setPersonToDelete(person);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!personToDelete) return;
    
    try {
      setIsDeleting(true);
      await personalService.deletePersonal(personToDelete._id);
      
      // Actualizar el estado local
      setPersonal(personal.filter(p => p._id !== personToDelete._id));
      
      toast({
        title: "¡Eliminado!",
        description: `${personToDelete.nombre} ${personToDelete.apellido} ha sido eliminado correctamente.`,
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el registro.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPersonToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      let updatedPerson;
      
      if (selectedPerson) {
        // Actualizar existente
        updatedPerson = await personalService.updatePersonal(selectedPerson._id, formData);
        setPersonal(personal.map(p => p._id === selectedPerson._id ? updatedPerson.empleado : p));
      } else {
        // Crear nuevo
        updatedPerson = await personalService.createPersonal(formData);
        setPersonal([...personal, updatedPerson.empleado]);
      }
      
      toast({
        title: "¡Guardado!",
        description: `Los datos de ${formData.nombre} ${formData.apellido} se han guardado correctamente.`,
        variant: "success",
      });
      
      setIsModalOpen(false);
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error al guardar:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    }
  };

  // Renderizar contenido de carga
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Personal</h2>
            <p className="text-gray-500">Cargando registros...</p>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar los datos</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={fetchPersonal}
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar vista principal
  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Personal</h2>
          <p className="text-muted-foreground">
            Gestiona el personal de tu organización
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Empleado
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar personal..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ml-4 flex space-x-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredPersonal.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No se encontró personal</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm
              ? 'No hay resultados para tu búsqueda.'
              : 'Comienza agregando un nuevo empleado.'}
          </p>
          <Button onClick={handleAddNew} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Empleado
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedPersonal.map((person) => (
            <PersonalCard
              key={person._id}
              person={person}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <PersonalTableView
            personal={paginatedPersonal}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modal para agregar/editar personal */}
      <PersonalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPerson(null);
        }}
        onSave={handleSave}
        person={selectedPerson}
      />

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente a{' '}
              <span className="font-semibold">
                {personToDelete?.nombre} {personToDelete?.apellido}
              </span>{' '}
              de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Vista detallada */}
      {showSingleView && currentPerson && (
        <PersonalSingle
          person={currentPerson}
          onClose={() => setShowSingleView(false)}
          onEdit={() => {
            setSelectedPerson(currentPerson);
            setShowSingleView(false);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default PersonalListing;