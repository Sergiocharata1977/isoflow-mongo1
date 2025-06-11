import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Pencil, 
  Calendar, 
  Users, 
  Building, 
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductoSingle = ({ producto, onBack, onEdit }) => {
  if (!producto) return null;

  const getEstadoBadge = (estado) => {
    if (!estado) return null;
    
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'aprobado') {
      return <Badge className="bg-green-500 text-white"><CheckCircle2 className="h-3 w-3 mr-1" /> {estado}</Badge>;
    } else if (estadoLower === 'en revisión' || estadoLower === 'en revision' || estadoLower === 'en desarrollo') {
      return <Badge className="bg-amber-500 text-white"><Clock className="h-3 w-3 mr-1" /> {estado}</Badge>;
    } else if (estadoLower === 'rechazado') {
      return <Badge className="bg-red-500 text-white"><XCircle className="h-3 w-3 mr-1" /> {estado}</Badge>;
    } else {
      return <Badge className="bg-blue-500 text-white">{estado}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{producto.nombre}</h1>
        </div>
        <Button onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="outline">{producto.tipo || "No especificado"}</Badge>
        {getEstadoBadge(producto.estado)}
        {producto.version && <Badge variant="outline">Versión {producto.version}</Badge>}
      </div>

      <Tabs defaultValue="informacion" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-4">
          <TabsTrigger value="informacion">Información General</TabsTrigger>
          <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
          <TabsTrigger value="desarrollo">Desarrollo y Verificación</TabsTrigger>
          <TabsTrigger value="validacion">Validación y Documentación</TabsTrigger>
        </TabsList>

        {/* Pestaña 1: Información General */}
        <TabsContent value="informacion">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de inicio</p>
                  <p className="font-medium">{producto.fecha_inicio || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Área Responsable</p>
                  <p className="font-medium">{producto.area_responsable || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Versión</p>
                  <p className="font-medium">{producto.version || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <div>{getEstadoBadge(producto.estado)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Cliente y Mercado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cliente Objetivo</p>
                  <p className="font-medium">{producto.cliente_objetivo || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Descripción Técnica</p>
                  <p className="whitespace-pre-line">{producto.descripcion_tecnica || "No especificado"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña 2: Requisitos */}
        <TabsContent value="requisitos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Requisitos Técnicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requisitos del Cliente</p>
                  <p className="whitespace-pre-line">{producto.requisitos_cliente || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Normas o Reglamentos Aplicables</p>
                  <p className="whitespace-pre-line">{producto.normas_aplicables || "No especificado"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Insumos y Almacenamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Origen del insumo</p>
                  <p>{producto.origen_insumo || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trazabilidad esperada</p>
                  <p>{producto.trazabilidad || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requisitos de almacenamiento</p>
                  <p className="whitespace-pre-line">{producto.requisitos_almacenamiento || "No especificado"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña 3: Desarrollo y Verificación */}
        <TabsContent value="desarrollo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Planificación del Desarrollo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fases de desarrollo</p>
                  <p className="whitespace-pre-line">{producto.fases_desarrollo || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recursos necesarios</p>
                  <p className="whitespace-pre-line">{producto.recursos_necesarios || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ensayos necesarios</p>
                  <p className="whitespace-pre-line">{producto.ensayos_necesarios || "No especificado"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Riesgos y Verificación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Matriz de riesgos</p>
                  <p className="whitespace-pre-line">{producto.matriz_riesgos || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de verificación técnica</p>
                  <p>{producto.fecha_verificacion || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ensayos realizados</p>
                  <p className="whitespace-pre-line">{producto.ensayos_realizados || "No especificado"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Resultados y Acciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resultados obtenidos</p>
                  <p className="whitespace-pre-line">{producto.resultados_obtenidos || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">No Conformidades encontradas</p>
                  <p className="whitespace-pre-line">{producto.no_conformidades || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Acciones correctivas implementadas</p>
                  <p className="whitespace-pre-line">{producto.acciones_correctivas || "No especificado"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña 4: Validación y Documentación */}
        <TabsContent value="validacion">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Validación Comercial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Validación con cliente</p>
                  <p className="whitespace-pre-line">{producto.validacion_cliente || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prueba de uso en campo</p>
                  <p className="whitespace-pre-line">{producto.prueba_campo || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resultado de validación</p>
                  <p>{producto.resultado_validacion || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                  <p className="whitespace-pre-line">{producto.observaciones || "No especificado"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Autorización y Documentación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Autorización para comercializar</p>
                  <p>{producto.autorizacion_comercializar || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documentación y Registros Adjuntos</p>
                  <p className="whitespace-pre-line">{producto.documentos_adjuntos || "No especificado"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductoSingle;
