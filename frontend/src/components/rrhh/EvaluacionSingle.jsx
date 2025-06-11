import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ClipboardCheck,
  User,
  Briefcase,
  Building,
  Calendar,
  Star,
  Target,
  CheckCircle,
  AlertTriangle,
  FileText
} from "lucide-react";

function EvaluacionSingle({ evaluacion, onBack, onEdit, onDelete }) {
  if (!evaluacion) return null;

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCalificacion = (calificacion) => {
    if (!calificacion || calificacion === 0) return "N/A";
    
    const estrellas = [];
    const calificacionRedondeada = Math.round(calificacion * 2) / 2; // Redondear a 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= calificacionRedondeada) {
        estrellas.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i - 0.5 === calificacionRedondeada) {
        estrellas.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        estrellas.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />);
      }
    }
    
    return (
      <div className="flex items-center">
        <div className="flex mr-1">{estrellas}</div>
        <span className="text-sm">({calificacion})</span>
      </div>
    );
  };

  const renderProgressBar = (percentage) => {
    const getProgressColor = (value) => {
      if (value < 50) return "bg-red-500";
      if (value < 75) return "bg-yellow-500";
      return "bg-green-500";
    };

    return (
      <div className="w-full bg-muted rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Evaluación de Desempeño</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(evaluacion)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(evaluacion.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              <div className="flex items-center space-x-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                <span>{evaluacion.codigo}</span>
              </div>
            </CardTitle>
            <Badge className={getEstadoBadgeColor(evaluacion.estado)}>
              {evaluacion.estado}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Empleado</p>
                  <p className="font-medium">{evaluacion.empleado}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Puesto</p>
                  <p className="font-medium">{evaluacion.puesto}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Departamento</p>
                  <p className="font-medium">{evaluacion.departamento}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Evaluador</p>
                  <p className="font-medium">{evaluacion.evaluador}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Periodo</p>
                  <p className="font-medium">{evaluacion.periodo}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Evaluación</p>
                  <p className="font-medium">{evaluacion.fechaEvaluacion}</p>
                </div>
              </div>
            </div>
          </div>

          {evaluacion.estado === 'completada' && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Calificación General</h3>
                <div className="flex items-center space-x-2">
                  {renderCalificacion(evaluacion.calificacionGeneral)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contenido detallado */}
      <Tabs defaultValue="competencias" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="competencias">Competencias</TabsTrigger>
          <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
          <TabsTrigger value="resultados">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="competencias" className="space-y-6">
          {evaluacion.competencias && evaluacion.competencias.length > 0 ? (
            evaluacion.competencias.map((competencia, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{competencia.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Calificación:</span>
                    {renderCalificacion(competencia.calificacion)}
                  </div>
                  {competencia.comentario && (
                    <div>
                      <span className="text-sm text-muted-foreground">Comentarios:</span>
                      <p className="mt-1">{competencia.comentario}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Star className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                No hay competencias evaluadas.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="objetivos" className="space-y-6">
          {evaluacion.objetivos && evaluacion.objetivos.length > 0 ? (
            evaluacion.objetivos.map((objetivo, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{objetivo.descripcion || "Objetivo sin descripción"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Cumplimiento:</span>
                      <span className="font-medium">{objetivo.cumplimiento}%</span>
                    </div>
                    {renderProgressBar(objetivo.cumplimiento)}
                  </div>
                  {objetivo.comentario && (
                    <div>
                      <span className="text-sm text-muted-foreground">Comentarios:</span>
                      <p className="mt-1">{objetivo.comentario}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Target className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                No hay objetivos evaluados.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resultados" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Fortalezas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {evaluacion.fortalezas ? (
                  <ul className="space-y-2">
                    {evaluacion.fortalezas.split('\n').map((fortaleza, index) => (
                      fortaleza.trim() && (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>{fortaleza}</span>
                        </li>
                      )
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No se han registrado fortalezas.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Áreas de Oportunidad</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {evaluacion.areasOportunidad ? (
                  <ul className="space-y-2">
                    {evaluacion.areasOportunidad.split('\n').map((area, index) => (
                      area.trim() && (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                          <span>{area}</span>
                        </li>
                      )
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No se han registrado áreas de oportunidad.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Comentarios Generales</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evaluacion.comentarios ? (
                <p className="whitespace-pre-line">{evaluacion.comentarios}</p>
              ) : (
                <p className="text-muted-foreground">No se han registrado comentarios generales.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Planes de Acción</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evaluacion.planesAccion ? (
                <ul className="space-y-2">
                  {evaluacion.planesAccion.split('\n').map((plan, index) => (
                    plan.trim() && (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{plan}</span>
                      </li>
                    )
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No se han registrado planes de acción.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default EvaluacionSingle;
