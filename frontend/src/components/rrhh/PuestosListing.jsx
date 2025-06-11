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
  Building2,
  Users,
  LayoutGrid,
  List,
  ChevronRight,
  Briefcase
} from "lucide-react";
import PuestoModal from "./PuestoModal";
import PuestoSingle from "./PuestoSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { puestosService } from "../../services/puestos";

function PuestosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentPuesto, setCurrentPuesto] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [puestoToDelete, setPuestoToDelete] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [filteredPuestos, setFilteredPuestos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPuestos();
  }, []);

  useEffect(() => {
    const filtered = puestos.filter(puesto =>
      puesto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      puesto.departamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      puesto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPuestos(filtered);
  }, [searchTerm, puestos]);

  const loadPuestos = async () => {
    try {
      setLoading(true);
      const data = await puestosService.getAll();
      setPuestos(data);
      setFilteredPuestos(data);
    } catch (error) {
      console.error("Error loading puestos:", error);
      toast.error("Error al cargar los puestos");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (puestoData) => {
    try {
      if (selectedPuesto) {
        await puestosService.update(selectedPuesto._id, puestoData);
        toast.success("Puesto actualizado exitosamente");
      } else {
        await puestosService.create(puestoData);
        toast.success("Puesto creado exitosamente");
      }
      loadPuestos();
      setIsModalOpen(false);
      setSelectedPuesto(null);
    } catch (error) {
      console.error("Error saving puesto:", error);
      toast.error("Error al guardar el puesto");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este puesto?")) {
      try {
        await puestosService.delete(id);
        toast.success("Puesto eliminado exitosamente");
        loadPuestos();
      } catch (error) {
        console.error("Error deleting puesto:", error);
        toast.error("Error al eliminar el puesto");
      }
    }
  };

  const handleEdit = (puesto) => {
    setSelectedPuesto(puesto);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPuesto(null);
    setIsModalOpen(true);
  };

  const handleViewPuesto = (puesto) => {
    setCurrentPuesto(puesto);
    setShowSingle(true);
  };

  if (showSingle) {
    return (
      <PuestoSingle
        puesto={currentPuesto}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Puestos</h1>
        <Button onClick={handleAddNew}>Nuevo Puesto</Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar puestos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div className="bg-card rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Nombre</th>
                  <th className="text-left p-4">Departamento</th>
                  <th className="text-left p-4">Descripción</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPuestos.map((puesto) => (
                  <tr key={puesto._id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{puesto.nombre}</td>
                    <td className="p-4">{puesto.departamento}</td>
                    <td className="p-4">{puesto.descripcion}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        puesto.estado === "activo" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {puesto.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(puesto)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(puesto._id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PuestoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPuesto(null);
        }}
        onSave={handleSave}
        puesto={selectedPuesto}
      />
    </div>
  );
}

export default PuestosListing;
