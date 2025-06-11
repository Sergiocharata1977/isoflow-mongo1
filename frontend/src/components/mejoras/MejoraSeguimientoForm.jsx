
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function MejoraSeguimientoForm({ onSave, onCancel, isLoading }) {
  const [formData, setFormData] = React.useState({
    fecha_seguimiento: "",
    responsable_seguimiento: "",
    indicadores_desempeno: "",
    resultados_monitoreo: "",
    tendencias_observadas: "",
    acciones_adicionales: "",
    proxima_revision: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_seguimiento">Fecha de Seguimiento</Label>
          <Input
            id="fecha_seguimiento"
            type="date"
            value={formData.fecha_seguimiento}
            onChange={(e) => setFormData({ ...formData, fecha_seguimiento: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsable_seguimiento">Responsable del Seguimiento</Label>
          <Input
            id="responsable_seguimiento"
            value={formData.responsable_seguimiento}
            onChange={(e) => setFormData({ ...formData, responsable_seguimiento: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="indicadores_desempeno">Indicadores de Desempeño</Label>
        <Textarea
          id="indicadores_desempeno"
          value={formData.indicadores_desempeno}
          onChange={(e) => setFormData({ ...formData, indicadores_desempeno: e.target.value })}
          required
          className="min-h-[100px]"
          placeholder="Lista los indicadores de desempeño monitoreados..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resultados_monitoreo">Resultados del Monitoreo</Label>
        <Textarea
          id="resultados_monitoreo"
          value={formData.resultados_monitoreo}
          onChange={(e) => setFormData({ ...formData, resultados_monitoreo: e.target.value })}
          required
          placeholder="Documenta los resultados del monitoreo realizado..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tendencias_observadas">Tendencias Observadas</Label>
        <Textarea
          id="tendencias_observadas"
          value={formData.tendencias_observadas}
          onChange={(e) => setFormData({ ...formData, tendencias_observadas: e.target.value })}
          required
          placeholder="Describe las tendencias observadas en los indicadores..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="acciones_adicionales">Acciones Adicionales Requeridas</Label>
        <Textarea
          id="acciones_adicionales"
          value={formData.acciones_adicionales}
          onChange={(e) => setFormData({ ...formData, acciones_adicionales: e.target.value })}
          placeholder="Documenta si se requieren acciones adicionales..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proxima_revision">Próxima Revisión</Label>
        <Input
          id="proxima_revision"
          type="date"
          value={formData.proxima_revision}
          onChange={(e) => setFormData({ ...formData, proxima_revision: e.target.value })}
          required
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
          {isLoading ? "Guardando..." : "Registrar Seguimiento"}
        </Button>
      </div>
    </form>
  );
}

export default MejoraSeguimientoForm;
