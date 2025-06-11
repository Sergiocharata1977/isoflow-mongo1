import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  FileText,
  Pencil,
  Trash2,
  Target,
  BarChart2,
  Ruler,
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  Link,
  AlertTriangle,
  ListChecks,
  Bookmark,
  ClipboardList,
  Briefcase,
  Calendar,
  Clock,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function ProcesoSingle({ proceso, onBack, onEdit, onDelete }) {
  
  // Función para obtener color según estado del proceso
  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'revision':
        return 'bg-yellow-100 text-yellow-800';
      case 'borrador':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Procesos
        </button>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={() => onEdit(proceso)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center text-destructive" 
            onClick={() => {
              if (window.confirm('¿Estás seguro de que deseas eliminar este proceso?')) {
                onDelete(proceso.id);
                onBack();
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Columna principal - 2 columnas */}
        <div className="col-span-2 space-y-6">
          {/* Cabecera del Proceso */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{proceso.titulo || proceso.nombre}</h1>
                    <div className="flex flex-wrap items-center mt-2 gap-4">
                      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                        <FileText className="h-4 w-4" />
                        Código: {proceso.codigo || 'PR-001'}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                        <Tag className="h-4 w-4" />
                        Versión {proceso.version || '1.0'}
                      </Badge>
                      <Badge 
                        className={`flex items-center gap-1 px-3 py-1 ${getEstadoColor(proceso.estado)}`}
                      >
                        {proceso.estado === "activo" ? 
                          <span className="w-2 h-2 rounded-full bg-green-600"></span> :
                          proceso.estado === "revision" ?
                          <AlertTriangle className="h-4 w-4" /> :
                          <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                        }
                        {proceso.estado || "Activo"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">{proceso.descripcion}</p>
              </div>
            </div>
          </motion.div>

          {/* Descripción del Proceso */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Descripción
            </h2>
            <p className="text-muted-foreground whitespace-pre-line">{proceso.descripcion}</p>
          </motion.div>
          
          {/* Información Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Información Principal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Objetivo</h3>
                <p className="text-sm">{proceso.objetivo || "No definido"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Alcance</h3>
                <p className="text-sm">{proceso.alcance || "No definido"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Responsable</h3>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Users className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-sm">{proceso.responsable || proceso.responsables?.split('\n')[0] || 'No asignado'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tipo de Proceso</h3>
                <p className="text-sm">{proceso.tipo || "Estratégico"}</p>
              </div>
            </div>
          </motion.div>

          {/* Documentos Relacionados */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Link className="h-5 w-5 mr-2 text-primary" />
              Documentos Relacionados
            </h2>
            <div className="space-y-2">
              {proceso.documentos?.map((documento, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-md hover:bg-accent border border-border">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="flex-1">{documento}</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!proceso.documentos || proceso.documentos.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No hay documentos relacionados</p>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Columna lateral - Información adicional */}
        <div className="col-span-1 space-y-6">
          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold mb-4">Información adicional</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha de creación</p>
                <p className="font-medium">{proceso.fechaCreacion || '09/05/2025'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Versión</p>
                <p className="font-medium">{proceso.version || '1.0'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Categoría</p>
                <p className="font-medium">{proceso.categoria || 'Procesos Operativos'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Última actualización</p>
                <p className="font-medium">{proceso.fechaActualizacion || '14/11/2025'}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Puntos de la Norma */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold flex items-center mb-4">
              <Bookmark className="h-5 w-5 mr-2 text-primary" />
              Puntos de la Norma
            </h2>
            <div className="space-y-2">
              {proceso.puntosNorma ? (
                proceso.puntosNorma.map((punto, index) => (
                  <div key={index} className="flex items-center p-3 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors">
                    <Badge className="bg-primary/10 text-primary border-primary/30 mr-3">{punto.codigo || '4.1'}</Badge>
                    <span className="flex-1 text-sm">{punto.descripcion || 'Comprensión de la organización y su contexto'}</span>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                // Datos de ejemplo si no hay datos reales
                [
                  { codigo: '4.1', descripcion: 'Comprensión de la organización y su contexto' },
                  { codigo: '4.2', descripcion: 'Comprensión de las necesidades y expectativas de las partes interesadas' },
                  { codigo: '6.1', descripcion: 'Acciones para abordar riesgos y oportunidades' }
                ].map((punto, index) => (
                  <div key={index} className="flex items-center p-3 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors">
                    <Badge className="bg-primary/10 text-primary border-primary/30 mr-3">{punto.codigo}</Badge>
                    <span className="flex-1 text-sm">{punto.descripcion}</span>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
          
          {/* Puestos Relacionados */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold flex items-center mb-4">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              Puestos Relacionados
            </h2>
            <div className="space-y-2">
              {proceso.puestosRelacionados ? (
                proceso.puestosRelacionados.map((puesto, index) => (
                  <div key={index} className="flex items-center p-3 rounded-md border border-border hover:bg-accent">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{puesto.nombre || 'Gerente de Calidad'}</p>
                      <p className="text-xs text-muted-foreground">{puesto.departamento || 'Departamento de Calidad'}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                // Datos de ejemplo si no hay datos reales
                [
                  { nombre: 'Gerente de Calidad', departamento: 'Departamento de Calidad' },
                  { nombre: 'Auditor Interno', departamento: 'Departamento de Calidad' },
                  { nombre: 'Responsable de Procesos', departamento: 'Operaciones' }
                ].map((puesto, index) => (
                  <div key={index} className="flex items-center p-3 rounded-md border border-border hover:bg-accent">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{puesto.nombre}</p>
                      <p className="text-xs text-muted-foreground">{puesto.departamento}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProcesoSingle;
