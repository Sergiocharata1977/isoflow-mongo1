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
  Ticket,
  BarChart2,
  PieChart,
  LineChart,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import ReactECharts from 'echarts-for-react';
import TicketModal from "./TicketModal";
import TicketSingle from "./TicketSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { createClient } from '@libsql/client';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function TicketsListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSingle, setShowSingle] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // Cliente Turso
  const client = createClient({
    url: "libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ"
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      
      // Intentar cargar desde Turso primero
      try {
        const result = await client.execute('SELECT * FROM tickets ORDER BY fechaCreacion DESC');
        if (result.rows.length > 0) {
          setTickets(result.rows);
          setIsLoading(false);
          return;
        }
      } catch (dbError) {
        console.log("Fallback a localStorage:", dbError);
      }
      
      // Fallback a localStorage
      const saved = localStorage.getItem("tickets");
      const data = saved ? JSON.parse(saved) : [];
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTicketToTurso = async (ticket) => {
    try {
      // Verificar si el ticket ya existe
      const checkResult = await client.execute({
        sql: 'SELECT id FROM tickets WHERE id = ?',
        args: [ticket.id]
      });

      if (checkResult.rows.length > 0) {
        // Actualizar
        await client.execute({
          sql: `UPDATE tickets SET 
                titulo = ?, 
                descripcion = ?, 
                solicitante = ?, 
                estado = ?, 
                prioridad = ?, 
                categoria = ?, 
                asignado = ?, 
                fechaCreacion = ? 
                WHERE id = ?`,
          args: [
            ticket.titulo,
            ticket.descripcion,
            ticket.solicitante,
            ticket.estado,
            ticket.prioridad,
            ticket.categoria,
            ticket.asignado,
            ticket.fechaCreacion,
            ticket.id
          ]
        });
      } else {
        // Insertar
        await client.execute({
          sql: `INSERT INTO tickets (
                id, 
                titulo, 
                descripcion, 
                solicitante, 
                estado, 
                prioridad, 
                categoria, 
                asignado, 
                fechaCreacion
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            ticket.id,
            ticket.titulo,
            ticket.descripcion,
            ticket.solicitante,
            ticket.estado,
            ticket.prioridad,
            ticket.categoria,
            ticket.asignado,
            ticket.fechaCreacion
          ]
        });
      }
      return true;
    } catch (error) {
      console.error("Error saving to Turso:", error);
      return false;
    }
  };

  const handleSave = async (ticketData) => {
    try {
      setIsLoading(true);
      let updatedTickets;
      let savedTicket;
      
      if (selectedTicket) {
        savedTicket = { 
          ...ticketData, 
          id: selectedTicket.id 
        };
        
        updatedTickets = tickets.map(t => 
          t.id === selectedTicket.id ? savedTicket : t
        );
        
        toast({
          title: "Ticket actualizado",
          description: "Los datos del ticket han sido actualizados exitosamente"
        });
      } else {
        savedTicket = { 
          ...ticketData, 
          id: Date.now(),
          fechaCreacion: new Date().toISOString()
        };
        
        updatedTickets = [...tickets, savedTicket];
        
        toast({
          title: "Ticket creado",
          description: "Se ha agregado un nuevo ticket exitosamente"
        });
      }
      
      // Guardar en Turso
      const tursoSaved = await saveTicketToTurso(savedTicket);
      if (!tursoSaved) {
        // Fallback a localStorage si falla Turso
        localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      }
      
      setTickets(updatedTickets);
      setIsModalOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el ticket",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const ticket = tickets.find(t => t.id === id);
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;
    
    try {
      setIsLoading(true);
      
      // Intentar eliminar de Turso primero
      try {
        await client.execute({
          sql: 'DELETE FROM tickets WHERE id = ?',
          args: [ticketToDelete.id]
        });
      } catch (dbError) {
        console.log("Fallback a localStorage para eliminar:", dbError);
      }
      
      // Actualizar estado local
      const updatedTickets = tickets.filter(t => t.id !== ticketToDelete.id);
      setTickets(updatedTickets);
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      
      toast({
        title: "Ticket eliminado",
        description: "El ticket ha sido eliminado exitosamente"
      });
      
      // Si estamos viendo el detalle del ticket que se eliminó, volver a la lista
      if (showSingle && currentTicket && currentTicket.id === ticketToDelete.id) {
        setShowSingle(false);
        setCurrentTicket(null);
      }
      
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el ticket",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTicket = (ticket) => {
    setCurrentTicket(ticket);
    setShowSingle(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Abierto':
        return 'bg-blue-100 text-blue-800';
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resuelto':
        return 'bg-green-100 text-green-800';
      case 'Cerrado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Si estamos viendo el detalle de un ticket
  if (showSingle && currentTicket) {
    return (
      <TicketSingle
        ticket={currentTicket}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  // Filtrar tickets según búsqueda
  const filteredTickets = tickets.filter(ticket =>
    ticket.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.solicitante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.asignado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Datos para gráficos
  const estadoData = [
    { name: 'Abierto', value: tickets.filter(t => t.estado === 'Abierto').length },
    { name: 'En Proceso', value: tickets.filter(t => t.estado === 'En Proceso').length },
    { name: 'Resuelto', value: tickets.filter(t => t.estado === 'Resuelto').length },
    { name: 'Cerrado', value: tickets.filter(t => t.estado === 'Cerrado').length }
  ].filter(item => item.value > 0);

  const prioridadData = [
    { name: 'Alta', value: tickets.filter(t => t.prioridad === 'Alta').length },
    { name: 'Media', value: tickets.filter(t => t.prioridad === 'Media').length },
    { name: 'Baja', value: tickets.filter(t => t.prioridad === 'Baja').length }
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
      
      const count = tickets.filter(t => {
        if (!t.fechaCreacion) return false;
        const date = new Date(t.fechaCreacion);
        return date >= startOfMonth && date <= endOfMonth;
      }).length;
      
      monthsData.push({
        name: monthName,
        tickets: count
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
                <Ticket className="h-4 w-4 mr-2" />
                Tickets
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
                setSelectedTicket(null);
                setIsModalOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Ticket
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Tickets</h3>
                <div className="flex items-center">
                  <Ticket className="h-8 w-8 text-primary mr-2" />
                  <span className="text-3xl font-bold">{tickets.length}</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Abiertos</h3>
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-blue-500 mr-2" />
                  <span className="text-3xl font-bold">{tickets.filter(t => t.estado === 'Abierto').length}</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">En Proceso</h3>
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500 mr-2" />
                  <span className="text-3xl font-bold">{tickets.filter(t => t.estado === 'En Proceso').length}</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Resueltos</h3>
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                  <span className="text-3xl font-bold">{tickets.filter(t => t.estado === 'Resuelto').length}</span>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico de Estado */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Tickets por Estado
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

              {/* Gráfico de Prioridad */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Tickets por Prioridad
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
                        data: ['Tickets']
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                      },
                      xAxis: {
                        type: 'category',
                        data: prioridadData.map(item => item.name)
                      },
                      yAxis: {
                        type: 'value'
                      },
                      series: [
                        {
                          name: 'Tickets',
                          type: 'bar',
                          data: prioridadData.map(item => item.value),
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
                  Tendencia de Tickets (Últimos 6 meses)
                </h3>
                <div className="h-64">
                  <ReactECharts 
                    option={{
                      tooltip: {
                        trigger: 'axis'
                      },
                      legend: {
                        data: ['Tickets']
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
                          name: 'Tickets',
                          type: 'line',
                          data: monthData.map(item => item.tickets),
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
                placeholder="Buscar tickets..."
                className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Lista de Tickets */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="text-left p-4">Solicitante</th>
                    <th className="text-left p-4">Título</th>
                    <th className="text-left p-4">Estado</th>
                    <th className="text-left p-4">Asignado a</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border cursor-pointer hover:bg-accent/50"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Ticket className="h-5 w-5 text-primary" />
                          <span className="font-medium">{ticket.solicitante}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm line-clamp-2">{ticket.titulo}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.estado)}`}>
                          {ticket.estado}
                        </span>
                      </td>
                      <td className="p-4">{ticket.asignado || "No asignado"}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(ticket);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(ticket.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    No hay tickets registrados. Haz clic en "Nuevo Ticket" para comenzar.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        onSave={handleSave}
        ticket={selectedTicket}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el ticket.
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

export default TicketsListing;
