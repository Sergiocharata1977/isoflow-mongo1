
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function MejoraPlanificacionForm({ onSave, onCancel, isLoading }) {
  const [formData, setFormData] = React.useState({
    acciones_correctivas: "",
    responsables: "",
    fecha_inicio: "",
    fecha_fin: "",
    recursos_necesarios: "",
    indicadores_seguimiento: "",
    presupuesto: "",
    riesgos_potenciales: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="acciones_correctivas">Acciones Correctivas Específicas</Label>
        <Textarea
          id="acciones_correctivas"
          value={formData.acciones_correctivas}
          onChange={(e) => setFormData({ ...formData, acciones_correctivas: e.target.value })}
          required
          className="min-h-[100px]"
          placeholder="Detalla las acciones correctivas a implementar..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsables">Responsables de la Implementación</Label>
        <Textarea
          id="responsables"
          value={formData.responsables}
          onChange={(e) => setFormData({ ...formData, responsables: e.target.value })}
          required
          placeholder="Lista los responsables y sus roles..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
          <Input
            id="fecha_inicio"
            type="date"
            value={formData.fecha_inicio}
            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_fin">Fecha de Finalización</Label>
          <Input
            id="fecha_fin"
            type="date"
            value={formData.fecha_fin}
            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recursos_necesarios">Recursos Necesarios</Label>
        <Textarea
          id="recursos_necesarios"
          value={formData.recursos_necesarios}
          onChange={(e) => setFormData({ ...formData, recursos_necesarios: e.target.value })}
          required
          placeholder="Describe los recursos materiales, humanos y técnicos necesarios..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="indicadores_seguimiento">Indicadores de Seguimiento</Label>
        <Textarea
          id="indicadores_seguimiento"
          value={formData.indicadores_seguimiento}
          onChange={(e) => setFormData({ ...formData, indicadores_seguimiento: e.target.value })}
          required
          placeholder="Define los indicadores para medir el progreso..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="presupuesto">Presupuesto Estimado</Label>
          <Input
            id="presupuesto"
            type="number"
            value={formData.presupuesto}
            onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="riesgos_potenciales">Riesgos Potenciales</Label>
        <Textarea
          id="riesgos_potenciales"
          value={formData.riesgos_potenciales}
          onChange={(e) => setFormData({ ...formData, riesgos_potenciales: e.target.value })}
          placeholder="Identifica posibles riesgos y medidas de mitigación..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Completar Planificación"}
        </Button>
      </div>
    </form>
  );
}

export default MejoraPlanificacionForm;
