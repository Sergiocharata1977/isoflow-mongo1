
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
  ClipboardCheck,
  Calendar,
  AlertCircle,
  ChevronRight,
  BarChart2,
  PieChart,
  LineChart,
  Filter
} from "lucide-react";
import ReactECharts from 'echarts-for-react';
import AuditoriaModal from "./AuditoriaModal";
import AuditoriaSingle from "./AuditoriaSingle";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { tursoClient, executeQuery } from '@/lib/tursoClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function AuditoriasListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentAuditoria, setCurrentAuditoria] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auditorias, setAuditorias] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [procesoFiltro, setProcesoFiltro] = useState("");
  const [procesos, setProcesos] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [auditoriaToDelete, setAuditoriaToDelete] = useState(null);

  // Usamos el cliente Turso centralizado

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Intentar cargar desde Turso primero
      try {
        const result = await executeQuery('SELECT * FROM auditorias ORDER BY fecha_programada DESC');
        if (result.rows.length > 0) {
          setAuditorias(result.rows);
          
          // Cargar procesos para el filtro
          const procesosResult = await executeQuery('SELECT * FROM procesos');
          if (procesosResult.rows.length > 0) {
            setProcesos(procesosResult.rows);
          } else {
            // Fallback a localStorage para procesos
            const savedProcesos = localStorage.getItem("procesos");
            const procesosData = savedProcesos ? JSON.parse(savedProcesos) : [];
            setProcesos(procesosData);
          }
          
          setIsLoading(false);
          return;
        }
      } catch (dbError) {
        console.log("Fallback a localStorage:", dbError);
      }
      
      // Fallback a localStorage
      const savedAuditorias = localStorage.getItem("auditorias");
      const auditoriasData = savedAuditorias ? JSON.parse(savedAuditorias) : [];
      setAuditorias(auditoriasData);

      // Cargar procesos para el filtro
      const savedProcesos = localStorage.getItem("procesos");
      const procesosData = savedProcesos ? JSON.parse(savedProcesos) : [];
      setProcesos(procesosData);

    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuditoriaToTurso = async (auditoria) => {
    try {
      // Verificar si la auditoría ya existe
      const checkResult = await executeQuery(
        'SELECT id FROM auditorias WHERE id = ?', [auditoria.id]
      });

      if (checkResult.rows.length > 0) {
        // Actualizar
        await executeQuery(
          `UPDATE auditorias SET 
                titulo = ?, 
                descripcion = ?, 
                tipo = ?, 
                fecha_programada = ?, 
                fecha_realizacion = ?, 
                responsable = ?, 
                norma = ?, 
                proceso = ?, 
                objetivo = ?, 
                estado = ?, 
                hallazgos = ? 
                WHERE id = ?`,
          [
            auditoria.titulo,
            auditoria.descripcion,
            auditoria.tipo,
            auditoria.fecha_programada,
            auditoria.fecha_realizacion,
            auditoria.responsable,
            auditoria.norma,
            auditoria.proceso,
            auditoria.objetivo,
            auditoria.estado,
            JSON.stringify(auditoria.hallazgos || []),
            auditoria.id
          ]
        );
      } else {
        // Insertar
        await executeQuery(
          `INSERT INTO auditorias (
                id, 
                titulo, 
                descripcion, 
                tipo, 
                fecha_programada, 
                fecha_realizacion, 
                responsable, 
                norma, 
                proceso, 
                objetivo, 
                estado, 
                hallazgos
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            auditoria.id,
            auditoria.titulo,
            auditoria.descripcion,
            auditoria.tipo,
            auditoria.fecha_programada,
            auditoria.fecha_realizacion,
            auditoria.responsable,
            auditoria.norma,
            auditoria.proceso,
            auditoria.objetivo,
            auditoria.estado,
            JSON.stringify(auditoria.hallazgos || [])
          ]
        );
      }
      return true;
    } catch (error) {
      console.error("Error saving to Turso:", error);
      return false;
    }
  };

  const handleSave = async (auditoriaData) => {
    try {
      setIsLoading(true);
      let updatedAuditorias;
      let savedAuditoria;
      
      if (selectedAuditoria) {
        savedAuditoria = { 
          ...auditoriaData, 
          id: selectedAuditoria.id 
        };
        
        updatedAuditorias = auditorias.map(a => 
          a.id === selectedAuditoria.id ? savedAuditoria : a
        );
        
        toast({
          title: "Auditoría actualizada",
          description: "Los datos de la auditoría han sido actualizados exitosamente"
        });
      } else {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const numero = `A${year}${month}-${random}`;
        
        savedAuditoria = { 
          ...auditoriaData, 
          id: Date.now(), 
          numero 
        };
        
        updatedAuditorias = [...auditorias, savedAuditoria];
        
        toast({
          title: "Auditoría creada",
          description: "Se ha agregado una nueva auditoría exitosamente"
        });
      }
      
      // Guardar en Turso
      const tursoSaved = await saveAuditoriaToTurso(savedAuditoria);
      if (!tursoSaved) {
        // Fallback a localStorage si falla Turso
        localStorage.setItem("auditorias", JSON.stringify(updatedAuditorias));
      }
      
      setAuditorias(updatedAuditorias);
      setIsModalOpen(false);
      setSelectedAuditoria(null);
    } catch (error) {
      console.error("Error saving auditoría:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la auditoría",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (auditoria) => {
    setSelectedAuditoria(auditoria);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setAuditoriaToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      
      // Intentar eliminar de Turso primero
      try {
        await executeQuery('DELETE FROM auditorias WHERE id = ?', [id]);
      } catch (dbError) {
        console.log("Fallback a localStorage para eliminar:", dbError);
      }
      
      // Actualizar estado local
      const updatedAuditorias = auditorias.filter(a => a.id !== id);
      setAuditorias(updatedAuditorias);
      localStorage.setItem("auditorias", JSON.stringify(updatedAuditorias));
      
      // Si estamos viendo el detalle de la auditoría que se eliminó, volver a la lista
      if (showSingle && currentAuditoria && currentAuditoria.id === id) {
        setShowSingle(false);
        setCurrentAuditoria(null);
      }
      
      toast({
        title: "Auditoría eliminada",
        description: "La auditoría ha sido eliminada exitosamente"
      });
      
      setIsDeleteDialogOpen(false);
      setAuditoriaToDelete(null);
    } catch (error) {
      console.error("Error deleting auditoría:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la auditoría",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAuditoria = (auditoria) => {
    setCurrentAuditoria(auditoria);
    setShowSingle(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Programada':
        return 'bg-blue-100 text-blue-800';
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completada':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Reporte de Auditorías', 14, 22);
    
    // Fecha
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Tabla
    const tableColumn = ["Número", "Fecha", "Responsable", "Proceso", "Estado"];
    const tableRows = [];

    filteredAuditorias.forEach(auditoria => {
      const auditoriaData = [
        auditoria.numero,
        new Date(auditoria.fecha_programada).toLocaleDateString(),
        auditoria.responsable,
        auditoria.proceso,
        auditoria.estado
      ];
      tableRows.push(auditoriaData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 }
    });

    doc.save('auditorias.pdf');
  };

  // Si estamos viendo el detalle de una auditoría
  if (showSingle && currentAuditoria) {
    return (
      <AuditoriaSingle
        auditoria={currentAuditoria}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={confirmDelete}
      />
    );
  }

  // Filtrar auditorías según búsqueda y proceso
  const filteredAuditorias = auditorias.filter(auditoria => 
    (auditoria.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     auditoria.objetivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     auditoria.responsable?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!procesoFiltro || auditoria.proceso === procesoFiltro)
  );

  // Datos para gráficos
  const estadoData = [
    { name: 'Programada', value: auditorias.filter(a => a.estado === 'Programada').length },
    { name: 'En Proceso', value: auditorias.filter(a => a.estado === 'En Proceso').length },
    { name: 'Completada', value: auditorias.filter(a => a.estado === 'Completada').length },
    { name: 'Cancelada', value: auditorias.filter(a => a.estado === 'Cancelada').length }
  ].filter(item => item.value > 0);

  const procesoData = procesos.map(proceso => ({
    name: proceso.titulo,
    value: auditorias.filter(a => a.proceso === proceso.titulo).length
  })).filter(item => item.value > 0);

  // Datos para gráfico de tendencia
  const getMonthData = () => {
    const monthsData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      const monthYear = `${monthName} ${month.getFullYear()}`;
      
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const count = auditorias.filter(a => {
        const date = new Date(a.fecha_programada);
        return date >= startOfMonth && date <= endOfMonth;
      }).length;
      
      monthsData.push({
        name: monthName,
        auditorias: count
      });
    }
    return monthsData;
  };

  const monthData = getMonthData();

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="dashboard">
                <BarChart2 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="list">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Auditorías
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={exportToPDF}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={() => {
                setSelectedAuditoria(null);
                setIsModalOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Auditoría
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Auditorías</h3>
                <div className="flex items-center">
                  <ClipboardCheck className="h-8 w-8 text-primary mr-2" />
                  <span className="text-3xl font-bold">{auditorias.length}</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Programadas</h3>
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500 mr-2" />
                  <span className="text-3xl font-bold">{auditorias.filter(a => a.estado === 'Programada').length}</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">En Proceso</h3>
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mr-2" />
                  <span className="text-3xl font-bold">{auditorias.filter(a => a.estado === 'En Proceso').length}</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Completadas</h3>
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                  <span className="text-3xl font-bold">{auditorias.filter(a => a.estado === 'Completada').length}</span>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico de Estado */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Auditorías por Estado
                </h3>
                <div className="h-64">
                  <ReactECharts 
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        right: 10,
                        top: 'center',
                        data: estadoData.map(item => item.name)
                      },
                      series: [
                        {
                          name: 'Estado',
                          type: 'pie',
                          radius: ['40%', '70%'],
                          avoidLabelOverlap: false,
                          itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                          },
                          label: {
                            show: false,
                            position: 'center'
                          },
                          emphasis: {
                            label: {
                              show: true,
                              fontSize: '14',
                              fontWeight: 'bold'
                            }
                          },
                          labelLine: {
                            show: false
                          },
                          data: estadoData.map((item, index) => ({
                            value: item.value,
                            name: item.name,
                            itemStyle: {
                              color: COLORS[index % COLORS.length]
                            }
                          }))
                        }
                      ]
                    }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              </div>

              {/* Gráfico de Procesos */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Auditorías por Proceso
                </h3>
                <div className="h-64">
                  <ReactECharts 
                    option={{
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        }
                      },
                      legend: {
                        data: ['Auditorías']
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                      },
                      xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                      },
                      yAxis: {
                        type: 'category',
                        data: procesoData.map(item => item.name)
                      },
                      series: [
                        {
                          name: 'Auditorías',
                          type: 'bar',
                          data: procesoData.map(item => item.value),
                          itemStyle: {
                            color: '#10b981'
                          }
                        }
                      ]
                    }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              </div>

              {/* Gráfico de Tendencia */}
              <div className="bg-card border border-border rounded-lg p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Tendencia de Auditorías (Últimos 6 meses)
                </h3>
                <div className="h-64">
                  <ReactECharts 
                    option={{
                      tooltip: {
                        trigger: 'axis'
                      },
                      legend: {
                        data: ['Auditorías']
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                      },
                      xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: monthData.map(item => item.name)
                      },
                      yAxis: {
                        type: 'value'
                      },
                      series: [
                        {
                          name: 'Auditorías',
                          type: 'line',
                          data: monthData.map(item => item.auditorias),
                          itemStyle: {
                            color: '#3b82f6'
                          },
                          areaStyle: {
                            color: {
                              type: 'linear',
                              x: 0,
                              y: 0,
                              x2: 0,
                              y2: 1,
                              colorStops: [{
                                offset: 0, color: 'rgba(59, 130, 246, 0.5)'
                              }, {
                                offset: 1, color: 'rgba(59, 130, 246, 0.05)'
                              }]
                            }
                          },
                          smooth: true
                        }
                      ]
                    }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar auditorías..."
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
            </div>

            {/* Lista de Auditorías */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="text-left p-4">Número</th>
                    <th className="text-left p-4">Fecha</th>
                    <th className="text-left p-4">Responsable</th>
                    <th className="text-left p-4">Objetivo</th>
                    <th className="text-left p-4">Estado</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditorias.map((auditoria) => (
                    <motion.tr
                      key={auditoria.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border cursor-pointer hover:bg-accent/50"
                      onClick={() => handleViewAuditoria(auditoria)}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <ClipboardCheck className="h-5 w-5 text-primary" />
                          <span className="font-medium">{auditoria.numero}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(auditoria.fecha_programada).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">{auditoria.responsable}</td>
                      <td className="p-4">
                        <p className="text-sm line-clamp-2">{auditoria.objetivo}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(auditoria.estado)}`}>
                          {auditoria.estado}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(auditoria);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(auditoria.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredAuditorias.length === 0 && (
                <div className="text-center py-12">
                  <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    No hay auditorías registradas. Haz clic en "Nueva Auditoría" para comenzar.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <AuditoriaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAuditoria(null);
        }}
        onSave={handleSave}
        auditoria={selectedAuditoria}
      />

      {/* Diálogo de confirmación para eliminar */}
      {isDeleteDialogOpen && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <p className="py-4">¿Estás seguro de que deseas eliminar esta auditoría? Esta acción no se puede deshacer.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(auditoriaToDelete)}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AuditoriasListing;
