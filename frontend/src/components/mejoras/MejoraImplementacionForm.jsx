
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function MejoraImplementacionForm({ onSave, onCancel, isLoading }) {
  const [formData, setFormData] = React.useState({
    acciones_realizadas: "",
    responsable_implementacion: "",
    fecha_implementacion: "",
    recursos_utilizados: "",
    desviaciones_plan: "",
    ajustes_realizados: "",
    evidencias: "",
    observaciones: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="acciones_realizadas">Acciones Realizadas</Label>
        <Textarea
          id="acciones_realizadas"
          value={formData.acciones_realizadas}
          onChange={(e) => setFormData({ ...formData, acciones_realizadas: e.target.value })}
          required
          className="min-h-[100px]"
          placeholder="Detalla las acciones implementadas..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="responsable_implementacion">Responsable de Implementación</Label>
          <Input
            id="responsable_implementacion"
            value={formData.responsable_implementacion}
            onChange={(e) => setFormData({ ...formData, responsable_implementacion: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_implementacion">Fecha de Implementación</Label>
          <Input
            id="fecha_implementacion"
            type="date"
            value={formData.fecha_implementacion}
            onChange={(e) => setFormData({ ...formData, fecha_implementacion: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recursos_utilizados">Recursos Utilizados</Label>
        <Textarea
          id="recursos_utilizados"
          value={formData.recursos_utilizados}
          onChange={(e) => setFormData({ ...formData, recursos_utilizados: e.target.value })}
          required
          placeholder="Lista los recursos utilizados en la implementación..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="desviaciones_plan">Desviaciones del Plan Original</Label>
        <Textarea
          id="desviaciones_plan"
          value={formData.desviaciones_plan}
          onChange={(e) => setFormData({ ...formData, desviaciones_plan: e.target.value })}
          placeholder="Describe cualquier desviación del plan original..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ajustes_realizados">Ajustes Realizados</Label>
        <Textarea
          id="ajustes_realizados"
          value={formData.ajustes_realizados}
          onChange={(e) => setFormData({ ...formData, ajustes_realizados: e.target.value })}
          placeholder="Describe los ajustes realizados durante la implementación..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="evidencias">Evidencias de Implementación</Label>
        <Textarea
          id="evidencias"
          value={formData.evidencias}
          onChange={(e) => setFormData({ ...formData, evidencias: e.target.value })}
          required
          placeholder="Documenta las evidencias de la implementación..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones Adicionales</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
          placeholder="Añade cualquier observación relevante..."
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
          {isLoading ? "Guardando..." : "Completar Implementación"}
        </Button>
      </div>
    </form>
  );
}

export default MejoraImplementacionForm;
