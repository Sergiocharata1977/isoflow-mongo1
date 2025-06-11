
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  ArrowUpCircle,
  Filter,
  LayoutGrid,
  List,
  BarChart2,
  ClipboardList,
  ClipboardCheck
} from "lucide-react";
import MejoraFormulario from "./MejoraFormulario";
import MejoraPlanificacionForm from "./MejoraPlanificacionForm";
import MejoraImplementacionForm from "./MejoraImplementacionForm";
import MejorasDashboard from "./MejorasDashboard";
import MejoraSingle from "./MejoraSingle";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClient } from '@libsql/client';

function MejorasListing() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMejora, setSelectedMejora] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mejoras, setMejoras] = useState([]);
  const [procesoFiltro, setProcesoFiltro] = useState("");
  const [procesos, setProcesos] = useState([]);
  const [formType, setFormType] = useState("registro");
  const [showSingleView, setShowSingleView] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mejoraToDelete, setMejoraToDelete] = useState(null);

  // Filtrar mejoras basado en búsqueda y proceso
  const filteredMejoras = React.useMemo(() => 
    (mejoras || []).filter(mejora => {
      const searchTermLower = searchTerm.toLowerCase();
      const titulo = mejora.titulo || '';
      const detalle = mejora.detalle || '';
      const proceso = mejora.proceso || '';
      
      return (
        (titulo.toLowerCase().includes(searchTermLower) ||
         detalle.toLowerCase().includes(searchTermLower)) &&
        (!procesoFiltro || proceso === procesoFiltro)
      );
    }), [mejoras, searchTerm, procesoFiltro]
  );
  // Cliente Turso
  const client = createClient({
    url: "libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Intentar cargar desde Turso primero
      try {
        const result = await client.execute({
          sql: 'SELECT * FROM mejoras ORDER BY fechaCreacion DESC',
          args: []
        });
        if (result.rows.length > 0) {
          setMejoras(result.rows);
          return;
        }
      } catch (dbError) {
        console.error("Error al cargar desde Turso:", dbError);
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar a la base de datos",
          variant: "destructive"
        });
      }

      // Fallback a localStorage
      const savedMejoras = localStorage.getItem("mejoras");
      if (savedMejoras) {
        setMejoras(JSON.parse(savedMejoras));
      }

      // Cargar procesos
      const savedProcesos = localStorage.getItem("procesos");
      if (savedProcesos) {
        setProcesos(JSON.parse(savedProcesos));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    }
  };

  const saveMejoraToTurso = async (mejora) => {
    try {
      // Convertir el objeto mejora a formato compatible con SQL
      const mejoraData = {
        id: mejora.id,
        titulo: mejora.titulo,
        detalle: mejora.detalle,
        proceso: mejora.proceso,
        estado: mejora.estado,
        accion_inmediata: mejora.accion_inmediata,
        fechaCreacion: mejora.fechaCreacion
      };

      // Verificar si la mejora ya existe
      const checkResult = await client.execute({
        sql: 'SELECT id FROM mejoras WHERE id = ?',
        args: [mejora.id]
      });

      if (checkResult.rows.length > 0) {
        // Actualizar
        await client.execute({
          sql: `UPDATE mejoras SET 
                titulo = ?, 
                detalle = ?, 
                proceso = ?, 
                estado = ?, 
                accion_inmediata = ? 
                WHERE id = ?`,
          args: [
            mejoraData.titulo,
            mejoraData.detalle,
            mejoraData.proceso,
            mejoraData.estado,
            mejoraData.accion_inmediata,
            mejoraData.id
          ]
        });
      } else {
        // Insertar
        await client.execute({
          sql: `INSERT INTO mejoras (id, titulo, detalle, proceso, estado, accion_inmediata, fechaCreacion) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            mejoraData.id,
            mejoraData.titulo,
            mejoraData.detalle,
            mejoraData.proceso,
            mejoraData.estado,
            mejoraData.accion_inmediata,
            mejoraData.fechaCreacion
          ]
        });
      }
      return true;
    } catch (error) {
      console.error("Error saving to Turso:", error);
      return false;
    }
  };

  const handleSave = async (mejoraData) => {
    try {
      let updatedMejoras;
      let savedMejora;

      if (selectedMejora) {
        // Actualizar mejora existente
        savedMejora = { 
          ...selectedMejora, 
          ...mejoraData 
        };
        
        updatedMejoras = mejoras.map(m => 
          m.id === selectedMejora.id ? savedMejora : m
        );
        
        toast({
          title: "Mejora actualizada",
          description: "Los datos de la mejora han sido actualizados exitosamente"
        });
      } else {
        // Crear nueva mejora
        savedMejora = { 
          ...mejoraData, 
          id: Date.now(),
          fechaCreacion: new Date().toISOString(),
          estadosCompletados: ["Hallazgo"]
        };
        
        updatedMejoras = [...mejoras, savedMejora];
        
        toast({
          title: "Mejora creada",
          description: "Se ha agregado una nueva mejora exitosamente"
        });
      }

      // Guardar en Turso
      const tursoSaved = await saveMejoraToTurso(savedMejora);
      if (!tursoSaved) {
        // Fallback a localStorage si falla Turso
        localStorage.setItem("mejoras", JSON.stringify(updatedMejoras));
      }

      setMejoras(updatedMejoras);
      setIsModalOpen(false);
      setSelectedMejora(null);
      setFormType("registro");
    } catch (error) {
      console.error("Error saving mejora:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la mejora",
        variant: "destructive"
      });
    }
  };

  const handlePlanificacionSave = (planificacionData) => {
    if (!selectedMejora) return;
    
    const updatedMejora = {
      ...selectedMejora,
      ...planificacionData,
      estado: "Planificación control",
      estadosCompletados: [...(selectedMejora.estadosCompletados || []), "Planificación control"]
    };
    
    handleSave(updatedMejora);
  };

  const handleImplementacionSave = (implementacionData) => {
    if (!selectedMejora) return;
    
    const updatedMejora = {
      ...selectedMejora,
      ...implementacionData,
      estado: "Control Hecho",
      estadosCompletados: [...(selectedMejora.estadosCompletados || []), "Control Hecho"]
    };
    
    handleSave(updatedMejora);
  };

  const handleEdit = (mejora) => {
    setSelectedMejora(mejora);
    
    // Determinar qué formulario mostrar basado en el estado de la mejora
    if (mejora.estado === "Planificación control" || 
        mejora.estadosCompletados?.includes("Acción Correctiva") || 
        mejora.estadosCompletados?.includes("Acción Preventiva")) {
      setFormType("planificacion");
    } else if (mejora.estado === "Control Hecho" || 
              mejora.estadosCompletados?.includes("Planificación control")) {
      setFormType("implementacion");
    } else {
      setFormType("registro");
    }
    
    setIsModalOpen(true);
  };

  const handleViewMejora = (mejora) => {
    setSelectedMejora(mejora);
    setShowSingleView(true);
  };

  const handleUpdateEstado = (updatedMejora) => {
    const updatedMejoras = mejoras.map(m => 
      m.id === updatedMejora.id ? updatedMejora : m
    );
    
    setMejoras(updatedMejoras);
    localStorage.setItem("mejoras", JSON.stringify(updatedMejoras));
    
    toast({
      title: "Estado actualizado",
      description: `La mejora ha avanzado a estado: ${updatedMejora.estado}`
    });
    
    setSelectedMejora(updatedMejora);
  };

  const confirmDelete = (id) => {
    setMejoraToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      // Intentar eliminar de Turso primero
      try {
        await client.execute({
          sql: 'DELETE FROM mejoras WHERE id = ?',
          args: [id]
        });
      } catch (dbError) {
        console.log("Fallback a localStorage para eliminar:", dbError);
      }

      // Actualizar estado local
      const updatedMejoras = mejoras.filter(m => m.id !== id);
      setMejoras(updatedMejoras);
      localStorage.setItem("mejoras", JSON.stringify(updatedMejoras));
      
      toast({
        title: "Mejora eliminada",
        description: "La mejora ha sido eliminada exitosamente"
      });
      
      setIsDeleteDialogOpen(false);
      setMejoraToDelete(null);
      
      if (showSingleView && selectedMejora?.id === id) {
        setShowSingleView(false);
        setSelectedMejora(null);
      }
    } catch (error) {
      console.error("Error deleting mejora:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la mejora",
        variant: "destructive"
      });
    }
  };



  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMejoras.map((mejora) => (
        <motion.div
          key={mejora.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ArrowUpCircle className="h-5 w-5 text-primary mr-2" />
                <span className={`px-2 py-1 rounded-full text-xs ${
                  mejora.estado === 'Hallazgo' ? 'bg-blue-100 text-blue-800' :
                  mejora.estado === 'Corrección' ? 'bg-yellow-100 text-yellow-800' :
                  mejora.estado === 'Análisis de Causas' ? 'bg-purple-100 text-purple-800' :
                  mejora.estado === 'Acción Correctiva' ? 'bg-green-100 text-green-800' :
                  mejora.estado === 'Acción Preventiva' ? 'bg-indigo-100 text-indigo-800' :
                  mejora.estado === 'Planificación control' ? 'bg-orange-100 text-orange-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {mejora.estado}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(mejora.fechaCreacion).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{mejora.titulo}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{mejora.detalle}</p>
            <div className="flex items-center text-xs text-muted-foreground mb-4">
              <span className="bg-primary/10 px-2 py-1 rounded">{mejora.proceso}</span>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleViewMejora(mejora)}>
                Ver Detalles
              </Button>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(mejora)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => confirmDelete(mejora.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 bg-muted/50 p-4 font-medium">
        <div className="col-span-4">Título</div>
        <div className="col-span-2">Proceso</div>
        <div className="col-span-2">Estado</div>
        <div className="col-span-2">Fecha</div>
        <div className="col-span-2 text-right">Acciones</div>
      </div>
      <div className="divide-y">
        {filteredMejoras.map((mejora) => (
          <motion.div
            key={mejora.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-12 items-center p-4 hover:bg-muted/50 cursor-pointer"
            onClick={() => handleViewMejora(mejora)}
          >
            <div className="col-span-4 font-medium truncate">{mejora.titulo}</div>
            <div className="col-span-2 text-sm">{mejora.proceso}</div>
            <div className="col-span-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                mejora.estado === 'Hallazgo' ? 'bg-blue-100 text-blue-800' :
                mejora.estado === 'Corrección' ? 'bg-yellow-100 text-yellow-800' :
                mejora.estado === 'Análisis de Causas' ? 'bg-purple-100 text-purple-800' :
                mejora.estado === 'Acción Correctiva' ? 'bg-green-100 text-green-800' :
                mejora.estado === 'Acción Preventiva' ? 'bg-indigo-100 text-indigo-800' :
                mejora.estado === 'Planificación control' ? 'bg-orange-100 text-orange-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {mejora.estado}
              </span>
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {new Date(mejora.fechaCreacion).toLocaleDateString()}
            </div>
            <div className="col-span-2 flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                handleEdit(mejora);
              }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                confirmDelete(mejora.id);
              }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Si estamos viendo una mejora individual
  if (showSingleView && selectedMejora) {
    return (
      <MejoraSingle
        mejora={selectedMejora}
        onBack={() => {
          setShowSingleView(false);
          setSelectedMejora(null);
        }}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        onUpdateEstado={handleUpdateEstado}
      />
    );
  }

  if (showSingleView && selectedMejora) {
    return (
      <MejoraSingle
        mejora={selectedMejora}
        onClose={() => {
          setShowSingleView(false);
          setSelectedMejora(null);
        }}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        onUpdateEstado={handleUpdateEstado}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="bg-card shadow-sm rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">Sistema de Gestión de Mejoras</h1>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setFormType("registro");
                setSelectedMejora(null);
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Mejora
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="listado" className="flex items-center">
            <List className="h-4 w-4 mr-2" />
            Listado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <MejorasDashboard mejoras={mejoras} />
        </TabsContent>

        <TabsContent value="listado">
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar mejoras..."
                  className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={procesoFiltro}
                  onChange={(e) => setProcesoFiltro(e.target.value)}
                >
                  <option value="">Todos los procesos</option>
                  {procesos.map((proceso) => (
                    <option key={proceso.id} value={proceso.titulo}>
                      {proceso.titulo}
                    </option>
                  ))}
                </select>
              </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  const csvContent = generateCSV(mejoras);
                  downloadCSV(csvContent, "mejoras.csv");
                }}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMejoras.map((mejora) => (
              <motion.div
                key={mejora.id}
                className="bg-card rounded-lg shadow-sm p-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold">{mejora.titulo}</h3>
                <p className="text-sm text-muted-foreground">{mejora.detalle}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{mejora.proceso}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewMejora(mejora)}
                    >
                      Ver más
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>

    {/* Modal para formulario de mejora */}
    {isModalOpen && (
      <Dialog open={isModalOpen} onOpenChange={() => {
        setIsModalOpen(false);
        setSelectedMejora(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMejora ? `Editar Mejora: ${selectedMejora.titulo}` : "Nueva Mejora"}
            </DialogTitle>
          </DialogHeader>
          
          {/* Pestañas para diferentes formularios */}
          <div className="flex space-x-2 mb-4">
            <Button
              type="button"
              variant={formType === "registro" ? "secondary" : "ghost"}
              onClick={() => setFormType("registro")}
              className="flex items-center"
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Registro
            </Button>
            <Button
              type="button"
              variant={formType === "planificacion" ? "secondary" : "ghost"}
              onClick={() => setFormType("planificacion")}
              className="flex items-center"
              disabled={!selectedMejora}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Planificación
            </Button>
            <Button
              type="button"
              variant={formType === "implementacion" ? "secondary" : "ghost"}
              onClick={() => setFormType("implementacion")}
              className="flex items-center"
              disabled={!selectedMejora || !selectedMejora.estadosCompletados?.includes("Planificación control")}
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Implementación
            </Button>
          </div>
          
          {formType === "registro" && (
            <MejoraFormulario
              onSave={handleSave}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedMejora(null);
              }}
              mejora={selectedMejora}
            />
          )}
          
          {formType === "planificacion" && (
            <MejoraPlanificacionForm
              onSave={handlePlanificacionSave}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedMejora(null);
              }}
              isLoading={false}
            />
          )}
          
          {formType === "implementacion" && (
            <MejoraImplementacionForm
              onSave={handleImplementacionSave}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedMejora(null);
              }}
              isLoading={false}
            />
          )}
        </DialogContent>
      </Dialog>
    )}

    {/* Diálogo de confirmación para eliminar */}
    {isDeleteDialogOpen && (
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p className="py-4">¿Estás seguro de que deseas eliminar esta mejora? Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(mejoraToDelete)}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
  </div>
);
}

export default MejorasListing;
