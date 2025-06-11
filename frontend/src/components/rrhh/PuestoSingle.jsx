import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Building2, 
  Users, 
  Briefcase,
  GraduationCap,
  ClipboardList,
  Shield,
  Award,
  Clock,
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

function PuestoSingle({ puesto, onBack, onEdit, onDelete }) {
  if (!puesto) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>No se encontró información del puesto.</p>
      </div>
    );
  }

  const renderFunciones = () => {
    if (!puesto.funciones) return null;
    
    const funciones = puesto.funciones.split('\n').filter(f => f.trim());
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <CardTitle>Funciones</CardTitle>
          </div>
          <CardDescription>
            Principales funciones y actividades del puesto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {funciones.map((funcion, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{funcion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  const renderResponsabilidades = () => {
    if (!puesto.responsabilidades) return null;
    
    const responsabilidades = puesto.responsabilidades.split('\n').filter(r => r.trim());
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Responsabilidades</CardTitle>
          </div>
          <CardDescription>
            Responsabilidades clave del puesto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {responsabilidades.map((responsabilidad, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{responsabilidad}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  const renderCompetencias = () => {
    if (!puesto.competencias) return null;
    
    const competencias = puesto.competencias.split('\n').filter(c => c.trim());
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle>Competencias</CardTitle>
          </div>
          <CardDescription>
            Habilidades y competencias requeridas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {competencias.map((competencia, index) => (
              <Badge key={index} variant="outline" className="bg-primary/5 hover:bg-primary/10">
                {competencia}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRequisitos = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle>Formación</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{puesto.formacion || "No especificado"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Experiencia</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{puesto.experiencia || "No especificado"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle>Requisitos adicionales</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{puesto.requisitos || "No especificado"}</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPersonal = () => {
    if (!puesto.personal || puesto.personal.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            No hay personal asignado a este puesto.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {puesto.personal.map((persona, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{persona.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {persona.departamento}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
          <h1 className="text-2xl font-bold">{puesto.nombre}</h1>
          <Badge variant={puesto.estado === "activo" ? "success" : "secondary"}>
            {puesto.estado}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(puesto)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(puesto._id)}
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
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Código</h3>
                <p className="text-sm text-muted-foreground">{puesto._id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Departamento</h3>
                <p className="text-sm text-muted-foreground">{puesto.departamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Supervisor</h3>
                <p className="text-sm text-muted-foreground">{puesto.supervisor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="funciones">Funciones</TabsTrigger>
          <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descripción del Puesto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{puesto.descripcion}</p>
            </CardContent>
          </Card>

          {renderFunciones()}
          {renderResponsabilidades()}
          {renderCompetencias()}
        </TabsContent>

        <TabsContent value="funciones" className="space-y-6">
          {renderFunciones()}
          {renderResponsabilidades()}
        </TabsContent>

        <TabsContent value="requisitos" className="space-y-6">
          {renderRequisitos()}
        </TabsContent>

        <TabsContent value="personal">
          {renderPersonal()}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default PuestoSingle;
