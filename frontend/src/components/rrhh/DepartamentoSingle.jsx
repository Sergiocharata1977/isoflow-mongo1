import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { 
  ArrowLeft,
  Building,
  Pencil,
  Trash2,
  Users,
  Target,
  Mail,
  Phone,
  MapPin,
  Banknote,
  Calendar,
  FileText,
  Link
} from "lucide-react";

function DepartamentoSingle({ departamento, onBack, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Departamentos
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(departamento)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete(departamento.id);
            onBack();
          }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Header Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{departamento.nombre}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    Responsable: {departamento.responsable}
                  </span>
                  {departamento.departamentoPadreId && (
                    <span className="flex items-center text-sm text-muted-foreground">
                      <Building className="h-4 w-4 mr-1" />
                      Departamento Superior: {departamento.departamentoPadreNombre}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Descripción y Objetivos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line">{departamento.descripcion}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Objetivos</h2>
              <p className="text-muted-foreground whitespace-pre-line">{departamento.objetivos}</p>
            </div>
          </motion.div>

          {/* Información de Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <Link className="h-5 w-5 mr-2" />
                Información de Contacto
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{departamento.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{departamento.telefono}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{departamento.ubicacion}</span>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2" />
                Información Adicional
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                  <span>Presupuesto: ${departamento.presupuesto}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Fecha de Creación: {new Date(departamento.fechaCreacion).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - 1 columna */}
        <div className="space-y-6">
          {/* Subdepartamentos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Building className="h-5 w-5 mr-2" />
              Subdepartamentos
            </h2>
            <div className="space-y-2">
              {departamento.subdepartamentos?.length > 0 ? (
                departamento.subdepartamentos.map((subdep, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{subdep.nombre}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay subdepartamentos registrados</p>
              )}
            </div>
          </motion.div>

          {/* Personal Asignado */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Users className="h-5 w-5 mr-2" />
              Personal Asignado
            </h2>
            <div className="space-y-2">
              {departamento.personal?.length > 0 ? (
                departamento.personal.map((persona, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{persona.nombre}</p>
                      <p className="text-sm text-muted-foreground">{persona.puesto}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay personal asignado</p>
              )}
            </div>
          </motion.div>

          {/* Objetivos Relacionados */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Target className="h-5 w-5 mr-2" />
              Objetivos Relacionados
            </h2>
            <div className="space-y-2">
              {departamento.objetivos?.length > 0 ? (
                departamento.objetivos.map((objetivo, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>{objetivo.titulo}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay objetivos relacionados</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DepartamentoSingle;
