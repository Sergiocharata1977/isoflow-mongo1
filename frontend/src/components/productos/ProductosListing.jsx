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
  Package,
  Filter,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from '@libsql/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ProductoModal from "./ProductoModal";
import ProductoSingle from "./ProductoSingle";

function ProductosListing() {
  const { toast } = useToast();
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [viewSingle, setViewSingle] = useState(false);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);

  // Cliente Turso
  const client = createClient({
    url: "libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ"
  });

  // Datos de ejemplo para mostrar si no hay datos en la base de datos
  const productosEjemplo = [
    {
      id: 1,
      nombre: "Fertilizante Orgánico Premium",
      tipo: "Fertilizante",
      fecha_inicio: "2025-01-15",
      area_responsable: "Técnica",
      cliente_objetivo: "Agricultor",
      version: "1.0",
      descripcion_tecnica: "Fertilizante orgánico de alta calidad compuesto por compost, humus de lombriz y microorganismos benéficos.",
      requisitos_cliente: "Alta concentración de nutrientes, fácil aplicación, certificación orgánica.",
      normas_aplicables: "SENASA 345/2022, ISO 14001",
      origen_insumo: "Producción propia",
      trazabilidad: "Lote y fecha de producción",
      requisitos_almacenamiento: "Lugar fresco y seco, temperatura menor a 30°C",
      fases_desarrollo: "Formulación, prueba de campo, validación, comercialización",
      recursos_necesarios: "Laboratorio de análisis, parcelas de prueba, personal técnico",
      matriz_riesgos: "Contaminación cruzada: Separación de líneas de producción\nVariabilidad de insumos: Control de proveedores",
      ensayos_necesarios: "Análisis de nutrientes, prueba de campo en cultivos de soja y maíz",
      fecha_verificacion: "2025-03-10",
      ensayos_realizados: "Germinación: Sí\nResiduales: Sí\nCompatibilidad: Sí\nSeguridad del operador: Sí",
      resultados_obtenidos: "Aumento de rendimiento del 15% en soja y 12% en maíz. Mejora en la estructura del suelo.",
      no_conformidades: "Variabilidad en la concentración de fósforo",
      acciones_correctivas: "Ajuste en el proceso de mezclado, control adicional de calidad",
      validacion_cliente: "Realizada con 5 productores de la zona",
      prueba_campo: "Parcelas demostrativas en 3 localidades",
      resultado_validacion: "Conforme",
      observaciones: "Excelente aceptación por parte de los productores. Sugerencia de mejorar el empaque.",
      autorizacion_comercializar: "Aprobado",
      documentos_adjuntos: "Ficha técnica, Hoja de seguridad, Resultados de ensayo",
      estado: "Aprobado",
      fecha_creacion: "2025-01-15",
      fecha_actualizacion: "2025-04-15"
    },
    {
      id: 2,
      nombre: "Tratamiento de Semillas TS-200",
      tipo: "Servicio de Tratamiento",
      fecha_inicio: "2025-02-10",
      area_responsable: "Investigación y Desarrollo",
      cliente_objetivo: "Semilleros",
      version: "1.2",
      descripcion_tecnica: "Servicio de tratamiento de semillas con fungicidas, insecticidas y bioestimulantes.",
      requisitos_cliente: "Protección contra plagas del suelo, estimulación de germinación, bajo impacto ambiental.",
      normas_aplicables: "SENASA 123/2023, ISO 9001",
      origen_insumo: "Proveedores certificados",
      trazabilidad: "Lote de semilla, fecha de tratamiento",
      requisitos_almacenamiento: "Ambiente controlado, humedad menor al 60%",
      fases_desarrollo: "Selección de activos, formulación, pruebas de eficacia, validación",
      recursos_necesarios: "Equipos de tratamiento, laboratorio de calidad, cámara de germinación",
      matriz_riesgos: "Fitotoxicidad: Pruebas previas\nResistencia: Rotación de activos",
      ensayos_necesarios: "Germinación, vigor, eficacia contra plagas objetivo",
      fecha_verificacion: "2025-03-20",
      ensayos_realizados: "Germinación: Sí\nVigencia: Sí\nEficacia: Sí",
      resultados_obtenidos: "Protección efectiva contra plagas del suelo por 45 días. Aumento del 8% en la tasa de germinación.",
      no_conformidades: "Variabilidad en la cobertura de semillas grandes",
      acciones_correctivas: "Ajuste de parámetros de la máquina tratadora para semillas de mayor tamaño",
      validacion_cliente: "Realizada con 3 semilleros importantes",
      prueba_campo: "Ensayos en 5 localidades",
      resultado_validacion: "Conforme con observaciones",
      observaciones: "Mejorar la uniformidad del tratamiento en semillas de mayor tamaño",
      autorizacion_comercializar: "Aprobado con condiciones",
      documentos_adjuntos: "Protocolo de tratamiento, Informe de eficacia, Hoja de seguridad",
      estado: "En Revisión",
      fecha_creacion: "2025-02-10",
      fecha_actualizacion: "2025-04-10"
    },
    {
      id: 3,
      nombre: "Sistema de Monitoreo de Cultivos",
      tipo: "Servicio Digital",
      fecha_inicio: "2025-03-01",
      area_responsable: "Tecnología",
      cliente_objetivo: "Productores agrícolas",
      version: "Beta",
      descripcion_tecnica: "Sistema de monitoreo basado en sensores IoT y análisis de imágenes satelitales para seguimiento de cultivos.",
      estado: "En Desarrollo",
      fecha_creacion: "2025-03-01",
      fecha_actualizacion: "2025-04-20"
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Intentar cargar desde Turso primero
      try {
        const result = await client.execute('SELECT * FROM productos ORDER BY fecha_creacion DESC');
        if (result.rows.length > 0) {
          setProductos(result.rows);
          setIsLoading(false);
          return;
        }
      } catch (dbError) {
        console.log("Fallback a localStorage:", dbError);
      }

      // Fallback a localStorage
      const saved = localStorage.getItem("productos");
      if (saved) {
        setProductos(JSON.parse(saved));
      } else {
        // Si no hay datos en localStorage, usar datos de ejemplo
        setProductos(productosEjemplo);
        // Guardar datos de ejemplo en localStorage
        localStorage.setItem("productos", JSON.stringify(productosEjemplo));
        
        // Intentar guardar datos de ejemplo en Turso
        try {
          for (const producto of productosEjemplo) {
            await saveProductoToTurso(producto);
          }
          console.log("Datos de ejemplo guardados en Turso");
        } catch (error) {
          console.error("Error al guardar datos de ejemplo en Turso:", error);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos. Por favor, intenta de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveProductoToTurso = async (producto) => {
    try {
      // Verificar si el producto ya existe
      const checkResult = await client.execute({
        sql: 'SELECT id FROM productos WHERE id = ?',
        args: [producto.id]
      });
      
      if (checkResult.rows.length > 0) {
        // Actualizar producto existente
        await client.execute('UPDATE productos SET nombre = ?, tipo = ?, fecha_inicio = ?, area_responsable = ?, cliente_objetivo = ?, version = ?, descripcion_tecnica = ?, requisitos_cliente = ?, normas_aplicables = ?, origen_insumo = ?, trazabilidad = ?, requisitos_almacenamiento = ?, fases_desarrollo = ?, recursos_necesarios = ?, matriz_riesgos = ?, ensayos_necesarios = ?, fecha_verificacion = ?, ensayos_realizados = ?, resultados_obtenidos = ?, no_conformidades = ?, acciones_correctivas = ?, validacion_cliente = ?, prueba_campo = ?, resultado_validacion = ?, observaciones = ?, autorizacion_comercializar = ?, documentos_adjuntos = ?, estado = ?, fecha_actualizacion = ? WHERE id = ?', 
          [producto.nombre, producto.tipo, producto.fecha_inicio, producto.area_responsable, producto.cliente_objetivo, producto.version, producto.descripcion_tecnica, producto.requisitos_cliente, producto.normas_aplicables, producto.origen_insumo, producto.trazabilidad, producto.requisitos_almacenamiento, producto.fases_desarrollo, producto.recursos_necesarios, producto.matriz_riesgos, producto.ensayos_necesarios, producto.fecha_verificacion, producto.ensayos_realizados, producto.resultados_obtenidos, producto.no_conformidades, producto.acciones_correctivas, producto.validacion_cliente, producto.prueba_campo, producto.resultado_validacion, producto.observaciones, producto.autorizacion_comercializar, producto.documentos_adjuntos, producto.estado, producto.fecha_actualizacion, producto.id]);
      } else {
        // Insertar nuevo producto
        await client.execute('INSERT INTO productos (id, nombre, tipo, fecha_inicio, area_responsable, cliente_objetivo, version, descripcion_tecnica, requisitos_cliente, normas_aplicables, origen_insumo, trazabilidad, requisitos_almacenamiento, fases_desarrollo, recursos_necesarios, matriz_riesgos, ensayos_necesarios, fecha_verificacion, ensayos_realizados, resultados_obtenidos, no_conformidades, acciones_correctivas, validacion_cliente, prueba_campo, resultado_validacion, observaciones, autorizacion_comercializar, documentos_adjuntos, estado, fecha_creacion, fecha_actualizacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [producto.id, producto.nombre, producto.tipo, producto.fecha_inicio, producto.area_responsable, producto.cliente_objetivo, producto.version, producto.descripcion_tecnica, producto.requisitos_cliente, producto.normas_aplicables, producto.origen_insumo, producto.trazabilidad, producto.requisitos_almacenamiento, producto.fases_desarrollo, producto.recursos_necesarios, producto.matriz_riesgos, producto.ensayos_necesarios, producto.fecha_verificacion, producto.ensayos_realizados, producto.resultados_obtenidos, producto.no_conformidades, producto.acciones_correctivas, producto.validacion_cliente, producto.prueba_campo, producto.resultado_validacion, producto.observaciones, producto.autorizacion_comercializar, producto.documentos_adjuntos, producto.estado, producto.fecha_creacion, producto.fecha_actualizacion]);
      }
    } catch (error) {
      console.error("Error al guardar en Turso:", error);
      throw error;
    }
  };

  const handleSave = async (productoData) => {
    try {
      setIsLoading(true);
      
      // Determinar si es una actualización o un nuevo producto
      const isUpdate = productoData.id !== undefined;
      
      // Crear objeto de producto
      const newProducto = {
        ...productoData,
        fecha_actualizacion: new Date().toISOString().split('T')[0]
      };
      
      if (!isUpdate) {
        // Asignar ID para nuevo producto
        const maxId = productos.length > 0 
          ? Math.max(...productos.map(p => parseInt(p.id))) 
          : 0;
        newProducto.id = maxId + 1;
        newProducto.fecha_creacion = newProducto.fecha_actualizacion;
      }
      
      // Intentar guardar en Turso primero
      try {
        await saveProductoToTurso(newProducto);
        console.log("Producto guardado en Turso correctamente");
      } catch (dbError) {
        console.error("Error al guardar en Turso, usando localStorage:", dbError);
      }
      
      // Actualizar estado local
      let updatedProductos;
      if (isUpdate) {
        // Actualizar producto existente
        updatedProductos = productos.map(p => 
          p.id === newProducto.id ? newProducto : p
        );
      } else {
        // Agregar nuevo producto
        updatedProductos = [...productos, newProducto];
      }
      
      // Actualizar estado y localStorage
      setProductos(updatedProductos);
      localStorage.setItem("productos", JSON.stringify(updatedProductos));
      
      // Cerrar modal y mostrar notificación
      setIsModalOpen(false);
      setSelectedProducto(null);
      
      toast({
        title: isUpdate ? "Producto actualizado" : "Producto creado",
        description: isUpdate 
          ? `El producto "${newProducto.nombre}" ha sido actualizado correctamente.` 
          : `El producto "${newProducto.nombre}" ha sido creado correctamente.`,
        variant: "default",
      });
      
    } catch (error) {
      console.error("Error al guardar producto:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el producto. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setProductoToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      
      // Intentar eliminar de Turso primero
      try {
        await client.execute({
          sql: 'DELETE FROM productos WHERE id = ?',
          args: [id]
        });
        console.log("Producto eliminado de Turso correctamente");
      } catch (dbError) {
        console.error("Error al eliminar de Turso, usando localStorage:", dbError);
      }
      
      // Eliminar de la lista local
      const updatedProductos = productos.filter(p => p.id !== id);
      
      // Actualizar estado y localStorage
      setProductos(updatedProductos);
      localStorage.setItem("productos", JSON.stringify(updatedProductos));
      
      // Cerrar diálogo y mostrar notificación
      setIsDeleteDialogOpen(false);
      setProductoToDelete(null);
      
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente.",
        variant: "default",
      });
      
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el producto. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (producto) => {
    setCurrentProducto(producto);
    setViewSingle(true);
  };

  const handleBackToList = () => {
    setViewSingle(false);
    setCurrentProducto(null);
  };

  const getEstadoBadge = (estado) => {
    if (!estado) return null;
    
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'aprobado') {
      return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> {estado}</Badge>;
    } else if (estadoLower === 'en revisión' || estadoLower === 'en revision' || estadoLower === 'en desarrollo') {
      return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" /> {estado}</Badge>;
    } else if (estadoLower === 'rechazado') {
      return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="h-3 w-3 mr-1" /> {estado}</Badge>;
    } else {
      return <Badge className="bg-blue-500 hover:bg-blue-600">{estado}</Badge>;
    }
  };

  // Filtrar productos por término de búsqueda
  const filteredProductos = productos.filter(producto => 
    producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion_tecnica?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.area_responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.cliente_objetivo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {viewSingle ? (
        <ProductoSingle 
          producto={currentProducto} 
          onBack={handleBackToList} 
          onEdit={() => handleEdit(currentProducto)}
        />
      ) : (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Planificación y Desarrollo de Productos</h1>
              <p className="text-muted-foreground">
                Gestión de productos y servicios según ISO 9001
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error al cargar los datos</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={loadData}>
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProductos.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-card border rounded-lg">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    No se encontraron productos. {searchTerm ? "Intenta con otra búsqueda." : "Haz clic en 'Nuevo Producto' para comenzar."}
                  </p>
                </div>
              ) : (
                filteredProductos.map((producto, index) => (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
                    onClick={() => handleViewDetail(producto)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold">{producto.nombre}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{producto.tipo}</Badge>
                            {getEstadoBadge(producto.estado)}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(producto);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(producto.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Área Responsable</p>
                          <p>{producto.area_responsable || "No especificado"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Cliente Objetivo</p>
                          <p>{producto.cliente_objetivo || "No especificado"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Fecha de Inicio</p>
                          <p>{producto.fecha_inicio || "No especificado"}</p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {producto.descripcion_tecnica || "Sin descripción técnica"}
                      </p>
                      
                      <Button variant="ghost" className="group">
                        Ver detalles
                        <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal para crear/editar productos */}
      {isModalOpen && (
        <ProductoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProducto(null);
          }}
          onSave={handleSave}
          producto={selectedProducto}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p className="py-4">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(productoToDelete)}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductosListing;
