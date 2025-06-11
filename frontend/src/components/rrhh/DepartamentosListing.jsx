import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  Building,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List
} from "lucide-react";
import DepartamentoModal from "./DepartamentoModal";
import DepartamentoSingle from "./DepartamentoSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../../components/ui/alert-dialog";
import { departamentosService } from "../../services/departamentos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

// Ya no usamos el cliente de Turso, ahora usamos MongoDB

function DepartamentosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDepts, setExpandedDepts] = useState([]);
  const [showSingle, setShowSingle] = useState(false);
  const [currentDepartamento, setCurrentDepartamento] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departamentoToDelete, setDepartamentoToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [departamentos, setDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDepartamentos();
  }, []);

  const loadDepartamentos = async () => {
    try {
      setIsLoading(true);
      const data = await departamentosService.getAll();
      setDepartamentos(data);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los departamentos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDepartamento = (id) => {
    setExpandedDepts(prev => {
      if (prev.includes(id)) {
        return prev.filter(deptId => deptId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSave = async (departamentoData) => {
    try {
      if (selectedDepartamento) {
        await departamentosService.update(selectedDepartamento._id, departamentoData);
        toast({
          title: "Departamento actualizado",
          description: "Los datos del departamento han sido actualizados exitosamente"
        });
      } else {
        await departamentosService.create(departamentoData);
        toast({
          title: "Departamento creado",
          description: "Se ha agregado un nuevo departamento exitosamente"
        });
      }
      
      await loadDepartamentos();
      setIsModalOpen(false);
      setSelectedDepartamento(null);
    } catch (error) {
      console.error("Error al guardar departamento:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el departamento",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id) => {
    setDepartamentoToDelete(departamentos.find(d => d._id === id));
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!departamentoToDelete) return;
      
      // Verificar si tiene subdepartamentos
      const tieneSubdepartamentos = departamentos.some(d => d.departamentoPadreId === departamentoToDelete._id);
      
      if (tieneSubdepartamentos) {
        toast({
          title: "No se puede eliminar",
          description: "Este departamento tiene subdepartamentos asociados. Elimine primero los subdepartamentos.",
          variant: "destructive"
        });
        setDeleteDialogOpen(false);
        return;
      }
      
      await departamentosService.delete(departamentoToDelete._id);
      await loadDepartamentos();
      
      toast({
        title: "Departamento eliminado",
        description: "El departamento ha sido eliminado exitosamente"
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el departamento",
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = (departamento) => {
    setSelectedDepartamento(departamento);
    setIsModalOpen(true);
  };

  const handleViewDepartamento = (departamento) => {
    setCurrentDepartamento(departamento);
    setShowSingle(true);
  };

  const renderDepartamento = (departamento, level = 0) => {
    const isExpanded = expandedDepts.includes(departamento._id);
    const hasChildren = departamentos.some(d => d.departamentoPadreId === departamento._id);
    const childDepartamentos = departamentos.filter(d => d.departamentoPadreId === departamento._id);
    
    return (
      <div key={departamento._id} className="border-b border-gray-200 last:border-b-0">
        <div 
          className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${level > 0 ? 'pl-' + (level * 8 + 4) + 'px' : ''}`}
          onClick={() => handleViewDepartamento(departamento)}
        >
          <div className="flex items-center">
            {hasChildren && (
              <button
                className="mr-2 p-1 rounded-full hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDepartamento(departamento._id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{departamento.nombre}</h3>
                <p className="text-sm text-muted-foreground">
                  {departamento.responsable}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(departamento);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(departamento._id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDepartamento(departamento);
              }}
            >
              <span className="mr-1">Ver detalles</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isExpanded && childDepartamentos.length > 0 && (
          <div className="border-t border-gray-100">
            {childDepartamentos.map(child => renderDepartamento(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderDepartamentoGrid = (departamento) => {
    return (
      <motion.div
        key={departamento._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
        onClick={() => handleViewDepartamento(departamento)}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{departamento.nombre}</h3>
              <p className="text-xs text-muted-foreground">
                {departamento.responsable}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {departamento.descripcion}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm flex items-center">
              <Building className="h-4 w-4 mr-1 text-muted-foreground" />
              {departamento.departamentoPadreId ? 
                departamentos.find(d => d._id === departamento.departamentoPadreId)?.nombre || "Sin departamento padre" : 
                "Departamento principal"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm flex items-center">
              {departamento.personal?.length || 0} miembros
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
              handleEdit(departamento);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(departamento._id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  };

  const filteredDepartamentos = departamentos.filter(dept =>
    dept.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rootDepartamentos = filteredDepartamentos.filter(d => !d.departamentoPadreId);

  if (showSingle) {
    // Enriquecer el departamento con información adicional
    const departamentoCompleto = { ...currentDepartamento };
    
    // Agregar subdepartamentos
    departamentoCompleto.subdepartamentos = departamentos
      .filter(d => d.departamentoPadreId === currentDepartamento._id)
      .map(d => ({ id: d._id, nombre: d.nombre }));
    
    // Agregar nombre del departamento padre si existe
    if (departamentoCompleto.departamentoPadreId) {
      const departamentoPadre = departamentos.find(d => d._id === departamentoCompleto.departamentoPadreId);
      if (departamentoPadre) {
        departamentoCompleto.departamentoPadreNombre = departamentoPadre.nombre;
      }
    }
    
    return (
      <DepartamentoSingle
        departamento={departamentoCompleto}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  if (isLoading) {
    return <div>Cargando departamentos...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Departamentos</CardTitle>
          <CardDescription>
            Administre los departamentos de la organización
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Buscar departamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => setIsModalOpen(true)}>
              Nuevo Departamento
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartamentos.map((departamento) => (
                <TableRow key={departamento._id}>
                  <TableCell>{departamento.nombre}</TableCell>
                  <TableCell>{departamento.responsable}</TableCell>
                  <TableCell>{departamento.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(departamento)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDepartamento(departamento)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(departamento._id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DepartamentoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDepartamento(null);
        }}
        onSave={handleSave}
        departamento={selectedDepartamento}
        departamentos={departamentos}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el departamento
              {departamentoToDelete && ` "${departamentoToDelete.nombre}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DepartamentosListing;
