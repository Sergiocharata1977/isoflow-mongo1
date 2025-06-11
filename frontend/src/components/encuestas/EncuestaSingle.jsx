import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  BarChart,
  User,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  PieChart,
  BarChart2,
  ChevronRight
} from "lucide-react";

function EncuestaSingle({ encuesta, onBack, onEdit, onDelete }) {
  if (!encuesta) return null;

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'inactiva':
        return 'bg-gray-100 text-gray-800';
      case 'borrador':
        return 'bg-yellow-100 text-yellow-800';
      case 'finalizada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calcularPorcentajeRespuestas = () => {
    if (!encuesta.totalDestinatarios || encuesta.totalDestinatarios === 0) return 0;
    return Math.round((encuesta.respuestas / encuesta.totalDestinatarios) * 100);
  };

  const renderProgressBar = (percentage) => {
    const getProgressColor = (value) => {
      if (value < 30) return "bg-red-500";
      if (value < 70) return "bg-yellow-500";
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
          <h1 className="text-2xl font-bold">Detalle de la Encuesta</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(encuesta)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(encuesta.id)}
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
                <BarChart className="h-5 w-5 text-primary" />
                <span>{encuesta.titulo}</span>
              </div>
            </CardTitle>
            <Badge className={getEstadoBadgeColor(encuesta.estado)}>
              {encuesta.estado}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Creado por</p>
                  <p className="font-medium">{encuesta.creador}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Destinatarios</p>
                  <p className="font-medium">{encuesta.tipoDestinatario || "Todos los usuarios"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                  <p className="font-medium">{formatDate(encuesta.fechaCreacion)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                  <p className="font-medium">{formatDate(encuesta.fechaInicio)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Finalización</p>
                  <p className="font-medium">{formatDate(encuesta.fechaFin)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Respuestas</p>
                  <p className="font-medium">{encuesta.respuestas || 0} de {encuesta.totalDestinatarios || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progreso de respuestas */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Progreso de respuestas</h3>
              <span className="font-medium">{calcularPorcentajeRespuestas()}%</span>
            </div>
            {renderProgressBar(calcularPorcentajeRespuestas())}
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div>
              <h3 className="font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Descripción
              </h3>
              <p className="mt-2 whitespace-pre-line">{encuesta.descripcion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preguntas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Preguntas</CardTitle>
        </CardHeader>
        <CardContent>
          {encuesta.preguntas && encuesta.preguntas.length > 0 ? (
            <div className="space-y-6">
              {encuesta.preguntas.map((pregunta, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{index + 1}. {pregunta.texto}</h4>
                    <Badge variant="outline">{pregunta.tipo}</Badge>
                  </div>
                  
                  {pregunta.tipo === 'opcion_multiple' && pregunta.opciones && (
                    <div className="mt-4 space-y-3">
                      {pregunta.opciones.map((opcion, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full border border-primary mr-2"></div>
                            <span>{opcion.texto}</span>
                          </div>
                          {encuesta.estado === 'finalizada' && (
                            <div className="flex items-center">
                              <span className="text-sm mr-2">{opcion.respuestas || 0}</span>
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${opcion.porcentaje || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm ml-2">{opcion.porcentaje || 0}%</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {pregunta.tipo === 'escala' && (
                    <div className="mt-4">
                      <div className="flex justify-between">
                        <span className="text-sm">{pregunta.valorMinimo || 1}</span>
                        <span className="text-sm">{pregunta.valorMaximo || 5}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        {Array.from({ length: (pregunta.valorMaximo || 5) - (pregunta.valorMinimo || 1) + 1 }).map((_, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-full border border-primary flex items-center justify-center">
                            {(pregunta.valorMinimo || 1) + idx}
                          </div>
                        ))}
                      </div>
                      {encuesta.estado === 'finalizada' && pregunta.promedio && (
                        <div className="mt-4 flex items-center">
                          <span className="text-sm mr-2">Promedio:</span>
                          <span className="font-medium">{pregunta.promedio.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {pregunta.tipo === 'texto' && encuesta.estado === 'finalizada' && pregunta.respuestas && (
                    <div className="mt-4 space-y-2">
                      <h5 className="text-sm font-medium">Respuestas ({pregunta.respuestas.length})</h5>
                      {pregunta.respuestas.slice(0, 3).map((respuesta, idx) => (
                        <div key={idx} className="bg-muted/50 p-2 rounded">
                          {respuesta}
                        </div>
                      ))}
                      {pregunta.respuestas.length > 3 && (
                        <Button variant="ghost" size="sm" className="flex items-center">
                          <span className="mr-1">Ver todas las respuestas</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No hay preguntas definidas para esta encuesta.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados (solo si la encuesta está finalizada) */}
      {encuesta.estado === 'finalizada' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-primary" />
                  Participación
                </h4>
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-8 border-primary" 
                      style={{ 
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(calcularPorcentajeRespuestas() * 0.01 * 2 * Math.PI)}% ${50 - 50 * Math.cos(calcularPorcentajeRespuestas() * 0.01 * 2 * Math.PI)}%, ${calcularPorcentajeRespuestas() >= 50 ? '100% 50%, 50% 50%' : '50% 50%'})` 
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{calcularPorcentajeRespuestas()}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p>{encuesta.respuestas || 0} de {encuesta.totalDestinatarios || 0} destinatarios</p>
                </div>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-4 flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                  Satisfacción general
                </h4>
                {encuesta.satisfaccionGeneral ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Promedio:</span>
                      <span className="font-bold text-lg">{encuesta.satisfaccionGeneral.toFixed(1)}/5</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Muy insatisfecho</span>
                        <span>Muy satisfecho</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full bg-primary"
                          style={{ width: `${(encuesta.satisfaccionGeneral / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No hay datos de satisfacción disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

export default EncuestaSingle;
