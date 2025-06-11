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
  MessageSquare,
  User,
  Calendar,
  Clock,
  Tag,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

function TicketSingle({ ticket, onBack, onEdit, onDelete }) {
  if (!ticket) return null;

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadBadgeColor = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
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
          <h1 className="text-2xl font-bold">Detalle del Ticket</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(ticket)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(ticket.id)}
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
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>{ticket.titulo}</span>
              </div>
            </CardTitle>
            <div className="flex space-x-2">
              <Badge className={getEstadoBadgeColor(ticket.estado)}>
                {ticket.estado}
              </Badge>
              <Badge className={getPrioridadBadgeColor(ticket.prioridad)}>
                {ticket.prioridad}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Solicitante</p>
                  <p className="font-medium">{ticket.solicitante}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Categoría</p>
                  <p className="font-medium">{ticket.categoria}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Asignado a</p>
                  <p className="font-medium">{ticket.asignado || "No asignado"}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                  <p className="font-medium">{formatDate(ticket.fechaCreacion)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha Límite</p>
                  <p className="font-medium">{formatDate(ticket.fechaLimite)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Cierre</p>
                  <p className="font-medium">{formatDate(ticket.fechaCierre) || "No cerrado"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div>
              <h3 className="font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Descripción
              </h3>
              <p className="mt-2 whitespace-pre-line">{ticket.descripcion}</p>
            </div>

            {ticket.solucion && (
              <div>
                <h3 className="font-medium flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Solución
                </h3>
                <p className="mt-2 whitespace-pre-line">{ticket.solucion}</p>
              </div>
            )}
          </div>

          {ticket.comentarios && ticket.comentarios.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  Comentarios
                </h3>
                <div className="space-y-4">
                  {ticket.comentarios.map((comentario, index) => (
                    <div key={index} className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{comentario.usuario}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(comentario.fecha)}
                        </div>
                      </div>
                      <p>{comentario.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {ticket.archivos && ticket.archivos.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Archivos Adjuntos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ticket.archivos.map((archivo, index) => (
                    <div key={index} className="flex items-center p-2 border border-border rounded-md">
                      <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{archivo.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default TicketSingle;
