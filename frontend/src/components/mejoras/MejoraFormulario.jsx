
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function MejoraFormulario({ onSave, onCancel, mejora, isLoading }) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Registro inicial
    numero: "",
    origen: "Interno",
    descripcion: "",
    consecuencia: "",
    accion_inmediata: "",
    estado_correccion: "Abierta",
    fecha_compromiso_correccion: "",
    fecha_cierre_correccion: "",
    proceso_involucrado: "",
    responsable_tratamiento: "",
    categoria: "Riesgo",

    // Tratamiento
    analisis_causas: "",
    documento_respaldo: "",
    requiere_accion: "Requiere acción",
    numero_accion: "",
    fecha_inicio_tratamiento: "",
    fecha_compromiso_implementacion: "",
    fecha_ejecucion: "",
    grupo_trabajo: "",
    tipo_accion: "Correctiva",
    responsable_implementacion: "",

    // Control
    responsable_verificacion: "",
    fecha_compromiso_verificacion: "",
    fecha_ejecucion_verificacion: "",
    criterios_eficacia: "",
    resultado_verificacion: "",
    estado_accion: "",
    observaciones: ""
  });

  const [procesos, setProcesos] = useState(() => {
    const saved = localStorage.getItem("procesos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (mejora) {
      setFormData(mejora);
      // Determinar el paso basado en el estado de la mejora
      if (mejora.estado === "Control") {
        setCurrentStep(3);
      } else if (mejora.estado === "Tratamiento") {
        setCurrentStep(2);
      }
    } else {
      // Generar número automático
      setFormData(prev => ({
        ...prev,
        numero: generateNumero()
      }));
    }
  }, [mejora]);

  const generateNumero = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `M${year}${month}-${random}`;
  };

  const calculateDateDifference = (date1, date2) => {
    if (!date1 || !date2) return null;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calcular diferencias de fechas
    const diferencias = {
      dias_correccion: calculateDateDifference(
        formData.fecha_compromiso_correccion,
        formData.fecha_cierre_correccion
      ),
      dias_implementacion: calculateDateDifference(
        formData.fecha_compromiso_implementacion,
        formData.fecha_ejecucion
      ),
      dias_verificacion: calculateDateDifference(
        formData.fecha_compromiso_verificacion,
        formData.fecha_ejecucion_verificacion
      )
    };

    onSave({ ...formData, ...diferencias });
  };

  const renderRegistroInicial = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nº</Label>
          <Input value={formData.numero} disabled />
        </div>
        <div className="space-y-2">
          <Label>Origen</Label>
          <select
            className="w-full h-10 px-3 border rounded-md bg-background"
            value={formData.origen}
            onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
          >
            <option value="Interno">Interno</option>
            <option value="Externo">Externo</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descripción y consecuencia</Label>
        <Textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Acción inmediata (Corrección)</Label>
        <Textarea
          value={formData.accion_inmediata}
          onChange={(e) => setFormData({ ...formData, accion_inmediata: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Estado de la Corrección</Label>
          <select
            className="w-full h-10 px-3 border rounded-md bg-background"
            value={formData.estado_correccion}
            onChange={(e) => setFormData({ ...formData, estado_correccion: e.target.value })}
          >
            <option value="Abierta">Abierta</option>
            <option value="Hecha">Hecha</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Categoría del hallazgo</Label>
          <select
            className="w-full h-10 px-3 border rounded-md bg-background"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          >
            <option value="Riesgo">Riesgo</option>
            <option value="Oportunidad">Oportunidad</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha de compromiso de la corrección</Label>
          <Input
            type="date"
            value={formData.fecha_compromiso_correccion}
            onChange={(e) => setFormData({ ...formData, fecha_compromiso_correccion: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Fecha de cierre de la corrección</Label>
          <Input
            type="date"
            value={formData.fecha_cierre_correccion}
            onChange={(e) => setFormData({ ...formData, fecha_cierre_correccion: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Proceso involucrado</Label>
          <select
            className="w-full h-10 px-3 border rounded-md bg-background"
            value={formData.proceso_involucrado}
            onChange={(e) => setFormData({ ...formData, proceso_involucrado: e.target.value })}
          >
            <option value="">Seleccione un proceso</option>
            {procesos.map((proceso) => (
              <option key={proceso.id} value={proceso.titulo}>
                {proceso.titulo}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Responsable del tratamiento del hallazgo</Label>
          <Input
            value={formData.responsable_tratamiento}
            onChange={(e) => setFormData({ ...formData, responsable_tratamiento: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderTratamiento = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Análisis de causas básicas (Raíz del problema)</Label>
        <Textarea
          value={formData.analisis_causas}
          onChange={(e) => setFormData({ ...formData, analisis_causas: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>¿Requiere acción?</Label>
          <select
            className="w-full h-10 px-3 border rounded-md bg-background"
            value={formData.requiere_accion}
            onChange={(e) => setFormData({ ...formData, requiere_accion: e.target.value })}
          >
            <option value="Requiere acción">Requiere acción</option>
            <option value="No requiere acción">No requiere acción</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Nº de Acción</Label>
          <Input
            value={formData.numero_accion}
            onChange={(e) => setFormData({ ...formData, numero_accion: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Fecha de inicio del tratamiento</Label>
          <Input
            type="date"
            value={formData.fecha_inicio_tratamiento}
            onChange={(e) => setFormData({ ...formData, fecha_inicio_tratamiento: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Fecha de compromiso de implementación</Label>
          <Input
            type="date"
            value={formData.fecha_compromiso_implementacion}
            onChange={(e) => setFormData({ ...formData, fecha_compromiso_implementacion: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Fecha de ejecución</Label>
          <Input
            type="date"
            value={formData.fecha_ejecucion}
            onChange={(e) => setFormData({ ...formData, fecha_ejecucion: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Grupo de Trabajo</Label>
          <Input
            value={formData.grupo_trabajo}
            onChange={(e) => setFormData({ ...formData, grupo_trabajo: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Tipo de Acción</Label>
          <select
            className="w-full h-10 px-3 border rounded-md bg-background"
            value={formData.tipo_accion}
            onChange={(e) => setFormData({ ...formData, tipo_accion: e.target.value })}
          >
            <option value="Correctiva">Correctiva</option>
            <option value="Preventiva">Preventiva</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Responsable de implementación</Label>
        <Input
          value={formData.responsable_implementacion}
          onChange={(e) => setFormData({ ...formData, responsable_implementacion: e.target.value })}
        />
      </div>
    </div>
  );

  const renderControl = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Responsable de la verificación de eficacia</Label>
        <Input
          value={formData.responsable_verificacion}
          onChange={(e) => setFormData({ ...formData, responsable_verificacion: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha de compromiso de verificación</Label>
          <Input
            type="date"
            value={formData.fecha_compromiso_verificacion}
            onChange={(e) => setFormData({ ...formData, fecha_compromiso_verificacion: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Fecha de ejecución de la verificación</Label>
          <Input
            type="date"
            value={formData.fecha_ejecucion_verificacion}
            onChange={(e) => setFormData({ ...formData, fecha_ejecucion_verificacion: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Criterios de eficacia</Label>
        <Textarea
          value={formData.criterios_eficacia}
          onChange={(e) => setFormData({ ...formData, criterios_eficacia: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Resultado de la verificación</Label>
        <Textarea
          value={formData.resultado_verificacion}
          onChange={(e) => setFormData({ ...formData, resultado_verificacion: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Estado de la acción</Label>
        <Input
          value={formData.estado_accion}
          onChange={(e) => setFormData({ ...formData, estado_accion: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Observaciones</Label>
        <Textarea
          value={formData.observaciones}
          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mejora ? "Editar Hallazgo" : "Nuevo Hallazgo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={currentStep === 1 ? "secondary" : "ghost"}
                onClick={() => setCurrentStep(1)}
              >
                Registro
              </Button>
              <Button
                type="button"
                variant={currentStep === 2 ? "secondary" : "ghost"}
                onClick={() => setCurrentStep(2)}
              >
                Tratamiento
              </Button>
              <Button
                type="button"
                variant={currentStep === 3 ? "secondary" : "ghost"}
                onClick={() => setCurrentStep(3)}
              >
                Control
              </Button>
            </div>
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && renderRegistroInicial()}
            {currentStep === 2 && renderTratamiento()}
            {currentStep === 3 && renderControl()}
          </motion.div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MejoraFormulario;
