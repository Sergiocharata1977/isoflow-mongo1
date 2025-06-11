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
  ClipboardList,
  BarChart2,
  PieChart,
  LineChart,
  Star,
  BarChart,
  ChevronRight
} from "lucide-react";
import ReactECharts from 'echarts-for-react';
import EncuestaModal from "./EncuestaModal";
import EncuestaSingle from "./EncuestaSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { createClient } from '@libsql/client';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function EncuestasListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEncuesta, setSelectedEncuesta] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [encuestas, setEncuestas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSingle, setShowSingle] = useState(false);
  const [currentEncuesta, setCurrentEncuesta] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [encuestaToDelete, setEncuestaToDelete] = useState(null);

  // Cliente Turso
  const client = createClient({
    url: "libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ"
  });

  useEffect(() => {
    loadEncuestas();
  }, []);

  const loadEncuestas = async () => {
    try {
      setIsLoading(true);
      
      // Intentar cargar desde Turso primero
      try {
        const result = await client.execute('SELECT * FROM encuestas');
        if (result.rows.length > 0) {
          setEncuestas(result.rows);
          setIsLoading(false);
          return;
        }
      } catch (dbError) {
        console.log("Fallback a localStorage:", dbError);
      }
      
      // Fallback a localStorage
      const saved = localStorage.getItem("encuestas");
      const data = saved ? JSON.parse(saved) : [];
      setEncuestas(data);
    } catch (error) {
      console.error("Error loading encuestas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las encuestas", 
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveEncuestaToTurso = async (encuesta) => {
    try {
      // Verificar si la encuesta ya existe
      const checkResult = await client.execute({
        sql: 'SELECT id FROM encuestas WHERE id = ?',
        args: [encuesta.id]
      });

      if (checkResult.rows.length > 0) {
        // Actualizar
        await client.execute({
          sql: `UPDATE encuestas SET 
                titulo = ?, 
                descripcion = ?, 
                creador = ?, 
                estado = ?, 
                tipoDestinatario = ?, 
                fechaCreacion = ?, 
                preguntas = ? 
                WHERE id = ?`,
          args: [
            encuesta.titulo,
            encuesta.descripcion,
            encuesta.creador,
            encuesta.estado,
            encuesta.tipoDestinatario,
            encuesta.fechaCreacion,
            JSON.stringify(encuesta.preguntas || []),
            encuesta.id
          ]
        });
      } else {
        // Insertar
        await client.execute({
          sql: `INSERT INTO encuestas (
                id, 
                titulo, 
                descripcion, 
                creador, 
                estado, 
                tipoDestinatario, 
                fechaCreacion, 
                preguntas
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            encuesta.id,
            encuesta.titulo,
            encuesta.descripcion,
            encuesta.creador,
            encuesta.estado,
            encuesta.tipoDestinatario,
            encuesta.fechaCreacion,
            JSON.stringify(encuesta.preguntas || [])
          ]
        });
      }
      return true;
    } catch (error) {
      console.error("Error saving to Turso:", error);
      return false;
    }
  };

  const handleSave = async (encuestaData) => {
    try {
      setIsLoading(true);
      let updatedEncuestas;
      let savedEncuesta;
      
      if (selectedEncuesta) {
        savedEncuesta = { 
          ...encuestaData, 
          id: selectedEncuesta.id 
        };
        
        updatedEncuestas = encuestas.map(e => 
          e.id === selectedEncuesta.id ? savedEncuesta : e
        );
        
        toast({
          title: "Encuesta actualizada",
          description: "Los datos de la encuesta han sido actualizados exitosamente"
        });
      } else {
        savedEncuesta = { 
          ...encuestaData, 
          id: Date.now(),
          fechaCreacion: new Date().toISOString().split('T')[0]
        };
        
        updatedEncuestas = [...encuestas, savedEncuesta];
        
        toast({
          title: "Encuesta creada",
          description: "Se ha agregado una nueva encuesta exitosamente"
        });
      }
      
      // Guardar en Turso
      const tursoSaved = await saveEncuestaToTurso(savedEncuesta);
      if (!tursoSaved) {
        // Fallback a localStorage si falla Turso
        localStorage.setItem("encuestas", JSON.stringify(updatedEncuestas));
      }
      
      setEncuestas(updatedEncuestas);
      setIsModalOpen(false);
      setSelectedEncuesta(null);
    } catch (error) {
      console.error("Error saving encuesta:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la encuesta",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (encuesta) => {
    setSelectedEncuesta(encuesta);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const encuesta = encuestas.find(e => e.id === id);
    setEncuestaToDelete(encuesta);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!encuestaToDelete) return;
    
    try {
      setIsLoading(true);
      
      // Intentar eliminar de Turso primero
      try {
        await client.execute({
          sql: 'DELETE FROM encuestas WHERE id = ?',
          args: [encuestaToDelete.id]
        });
      } catch (dbError) {
        console.log("Fallback a localStorage para eliminar:", dbError);
      }
      
      // Actualizar estado local
      const updatedEncuestas = encuestas.filter(e => e.id !== encuestaToDelete.id);
      setEncuestas(updatedEncuestas);
      localStorage.setItem("encuestas", JSON.stringify(updatedEncuestas));
      
      toast({
        title: "Encuesta eliminada",
        description: "La encuesta ha sido eliminada exitosamente"
      });
      
      // Si estamos viendo el detalle de la encuesta que se eliminó, volver a la lista
      if (showSingle && currentEncuesta && currentEncuesta.id === encuestaToDelete.id) {
        setShowSingle(false);
        setCurrentEncuesta(null);
      }
      
      setDeleteDialogOpen(false);
      setEncuestaToDelete(null);
    } catch (error) {
      console.error("Error deleting encuesta:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la encuesta",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewEncuesta = (encuesta) => {
    setCurrentEncuesta(encuesta);
    setShowSingle(true);
  };

  // Si estamos viendo el detalle de una encuesta
  if (showSingle && currentEncuesta) {
    return (
      <EncuestaSingle
        encuesta={currentEncuesta}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  // Filtrar encuestas según búsqueda
  const filteredEncuestas = encuestas.filter(encuesta =>
    encuesta.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encuesta.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encuesta.creador?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Datos para gráficos
  const estadoData = [
    { name: 'Activa', value: encuestas.filter(e => e.estado === 'activa').length },
    { name: 'Finalizada', value: encuestas.filter(e => e.estado === 'finalizada').length },
    { name: 'Borrador', value: encuestas.filter(e => e.estado === 'borrador').length }
  ].filter(item => item.value > 0);

  const tipoData = [
    { name: 'Clientes', value: encuestas.filter(e => e.tipoDestinatario === 'clientes').length },
    { name: 'Empleados', value: encuestas.filter(e => e.tipoDestinatario === 'empleados').length },
    { name: 'Proveedores', value: encuestas.filter(e => e.tipoDestinatario === 'proveedores').length },
    { name: 'Todos', value: encuestas.filter(e => !e.tipoDestinatario || e.tipoDestinatario === 'todos').length }
  ].filter(item => item.value > 0);

  // Datos para gráfico de tendencia
  const getMonthData = () => {
    const monthsData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const count = encuestas.filter(e => {
        if (!e.fechaCreacion) return false;
        const date = new Date(e.fechaCreacion);
        return date >= startOfMonth && date <= endOfMonth;
      }).length;
      
      monthsData.push({
        name: monthName,
        encuestas: count
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="dashboard">
                <BarChart2 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="list">
                <ClipboardList className="h-4 w-4 mr-2" />
                Encuestas
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => {
                // Exportar a PDF o CSV
                toast({
                  title: "Exportación iniciada",
                  description: "Se está generando el archivo de exportación"
                });
              }}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={() => {
                setSelectedEncuesta(null);
                setIsModalOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Encuesta
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Encuestas</h3>
                <div className="flex items-center">
                  <ClipboardList className="h-8 w-8 text-primary mr-2" />
                  <span className="text-3xl font-bold">{encuestas.length}</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Encuestas Activas</h3>
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-500 mr-2" />
                  <span className="text-3xl font-bold">{encuestas.filter(e => e.estado === 'activa').length}</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Encuestas Finalizadas</h3>
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                  <span className="text-3xl font-bold">{encuestas.filter(e => e.estado === 'finalizada').length}</span>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico de Estado */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Encuestas por Estado
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

              {/* Gráfico de Tipo */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Encuestas por Tipo
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
                        data: ['Encuestas']
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                      },
                      xAxis: {
                        type: 'category',
                        data: tipoData.map(item => item.name)
                      },
                      yAxis: {
                        type: 'value'
                      },
                      series: [
                        {
                          name: 'Encuestas',
                          type: 'bar',
                          data: tipoData.map(item => item.value),
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
                  Tendencia de Encuestas (Últimos 6 meses)
                </h3>
                <div className="h-64">
                  <ReactECharts 
                    option={{
                      tooltip: {
                        trigger: 'axis'
                      },
                      legend: {
                        data: ['Encuestas']
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
                          name: 'Encuestas',
                          type: 'line',
                          data: monthData.map(item => item.encuestas),
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

          <TabsContent value="list">
            {/* Barra de búsqueda */}
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar encuestas..."
                className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Lista de Encuestas */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="text-left p-4">Título</th>
                    <th className="text-left p-4">Creador</th>
                    <th className="text-left p-4">Estado</th>
                    <th className="text-left p-4">Destinatario</th>
                    <th className="text-left p-4">Fecha</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEncuestas.map((encuesta) => (
                    <motion.tr
                      key={encuesta.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border cursor-pointer hover:bg-accent/50"
                      onClick={() => handleViewEncuesta(encuesta)}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <BarChart className="h-5 w-5 text-primary" />
                          <span className="font-medium">{encuesta.titulo}</span>
                        </div>
                      </td>
                      <td className="p-4">{encuesta.creador}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          encuesta.estado === 'activa' ? 'bg-green-100 text-green-800' :
                          encuesta.estado === 'finalizada' ? 'bg-blue-100 text-blue-800' :
                          encuesta.estado === 'borrador' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {encuesta.estado || 'Borrador'}
                        </span>
                      </td>
                      <td className="p-4">{encuesta.tipoDestinatario || "Todos"}</td>
                      <td className="p-4">{encuesta.fechaCreacion}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(encuesta);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(encuesta.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredEncuestas.length === 0 && (
                <div className="text-center py-12">
                  <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    No hay encuestas registradas. Haz clic en "Nueva Encuesta" para comenzar.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <EncuestaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEncuesta(null);
        }}
        onSave={handleSave}
        encuesta={selectedEncuesta}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la encuesta.
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

export default EncuestasListing;
