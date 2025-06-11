
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Pencil,
  Trash2,
  FileText,
  Building2,
  ArrowUpCircle,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

function MejoraSingle({ mejora, onBack, onEdit, onDelete, onUpdateEstado }) {
  const estados = [
    'Hallazgo',
    'Corrección',
    'Análisis de Causas',
    'Acción Correctiva',
    'Acción Preventiva',
    'Planificación control',
    'Control Hecho'
  ];

  const getEstadoColor = (estado, isCompleted) => {
    const colores = {
      'Hallazgo': 'bg-blue-100 text-blue-800',
      'Corrección': 'bg-yellow-100 text-yellow-800',
      'Análisis de Causas': 'bg-purple-100 text-purple-800',
      'Acción Correctiva': 'bg-green-100 text-green-800',
      'Acción Preventiva': 'bg-indigo-100 text-indigo-800',
      'Planificación control': 'bg-orange-100 text-orange-800',
      'Control Hecho': 'bg-emerald-100 text-emerald-800'
    };
    return isCompleted ? colores[estado] : 'bg-gray-100 text-gray-800';
  };

  const handleEstadoClick = (estado) => {
    const currentIndex = estados.indexOf(mejora.estado);
    const clickedIndex = estados.indexOf(estado);

    if (clickedIndex === currentIndex + 1) {
      const updatedMejora = {
        ...mejora,
        estado: estado,
        estadosCompletados: [...(mejora.estadosCompletados || []), estado]
      };
      onUpdateEstado(updatedMejora);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Mejoras
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(mejora)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete(mejora.id);
            onBack();
          }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-3 gap-6">
        {/* Información Principal - 2 columnas */}
        <div className="col-span-2 space-y-6">
          {/* Header Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <ArrowUpCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{mejora.titulo}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    Proceso: {mejora.proceso}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(mejora.fechaCreacion).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detalle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">Detalle</h2>
              <p className="text-muted-foreground whitespace-pre-line">{mejora.detalle}</p>
            </div>
          </motion.div>

          {/* Acción Inmediata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-2">Acción Inmediata</h2>
            <p className="text-muted-foreground whitespace-pre-line">{mejora.accion_inmediata}</p>
          </motion.div>
        </div>

        {/* Sidebar - 1 columna */}
        <div className="space-y-6">
          {/* Estado y Progreso */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2" />
              Estado del Proceso
            </h2>
            <div className="space-y-4">
              {estados.map((estado, index) => {
                const isCurrentState = mejora.estado === estado;
                const isCompleted = (mejora.estadosCompletados || []).includes(estado);
                const isNext = estados.indexOf(mejora.estado) + 1 === index;
                
                return (
                  <div 
                    key={estado}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${
                      isNext ? 'cursor-pointer hover:bg-accent/50' : ''
                    }`}
                    onClick={() => isNext && handleEstadoClick(estado)}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : isCurrentState ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      getEstadoColor(estado, isCompleted || isCurrentState)
                    }`}>
                      {estado}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MejoraSingle;
