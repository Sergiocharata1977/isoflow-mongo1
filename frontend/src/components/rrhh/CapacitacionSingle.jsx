import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  GraduationCap, 
  Users, 
  Calendar,
  Clock,
  MapPin,
  FileText,
  Target,
  CheckCircle,
  UserCheck
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

function CapacitacionSingle({ capacitacion, onBack, onEdit, onDelete }) {
  if (!capacitacion) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>No se encontró información de la capacitación.</p>
      </div>
    );
  }

  const getEstadoBadgeVariant = (estado) => {
    switch (estado) {
      case 'programada':
        return 'secondary';
      case 'en curso':
        return 'default';
      case 'completada':
        return 'success';
      case 'cancelada':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const renderObjetivos = () => {
    if (!capacitacion.objetivos) return null;
    
    const objetivos = capacitacion.objetivos.split('\n').filter(o => o.trim());
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Objetivos</CardTitle>
          </div>
          <CardDescription>
            Objetivos de aprendizaje de la capacitación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {objetivos.map((objetivo, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{objetivo}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  const renderContenido = () => {
    if (!capacitacion.contenido) return null;
    
    const contenidos = capacitacion.contenido.split('\n').filter(c => c.trim());
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Contenido</CardTitle>
          </div>
          <CardDescription>
            Temario y contenidos de la capacitación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {contenidos.map((contenido, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{contenido}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  const renderParticipantes = () => {
    if (!capacitacion.participantes || capacitacion.participantes.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            No hay participantes registrados en esta capacitación.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Lista de Participantes</h3>
          <Badge variant="outline">{capacitacion.participantes.length} / {capacitacion.cupoMaximo}</Badge>
        </div>
        {capacitacion.participantes.map((participante, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{participante.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {participante.departamento}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderEvaluacion = () => {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <CardTitle>Método de Evaluación</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>{capacitacion.evaluacion || "No se ha definido un método de evaluación"}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{capacitacion.titulo}</h1>
          <Badge variant={getEstadoBadgeVariant(capacitacion.estado)}>
            {capacitacion.estado}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(capacitacion)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(capacitacion.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Fecha</h3>
                <p className="text-muted-foreground">
                  {capacitacion.fechaInicio === capacitacion.fechaFin 
                    ? capacitacion.fechaInicio 
                    : `${capacitacion.fechaInicio} al ${capacitacion.fechaFin}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Duración</h3>
                <p className="text-muted-foreground">{capacitacion.duracion} ({capacitacion.horario})</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Ubicación</h3>
                <p className="text-muted-foreground">{capacitacion.lugar} ({capacitacion.modalidad})</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descripción */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Información General</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Código: {capacitacion.codigo}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Descripción</h3>
            <p>{capacitacion.descripcion}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
            <div>
              <h3 className="font-medium mb-1">Instructor</h3>
              <p className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                {capacitacion.instructor}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Departamento</h3>
              <p>{capacitacion.departamento}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Cupo Máximo</h3>
              <p>{capacitacion.cupoMaximo} participantes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs con información detallada */}
      <Tabs defaultValue="objetivos" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="objetivos">Objetivos y Contenido</TabsTrigger>
          <TabsTrigger value="participantes">Participantes</TabsTrigger>
          <TabsTrigger value="evaluacion">Evaluación</TabsTrigger>
        </TabsList>
        
        <TabsContent value="objetivos" className="mt-0">
          {renderObjetivos()}
          {renderContenido()}
        </TabsContent>
        
        <TabsContent value="participantes" className="mt-0">
          {renderParticipantes()}
        </TabsContent>
        
        <TabsContent value="evaluacion" className="mt-0">
          {renderEvaluacion()}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default CapacitacionSingle;
