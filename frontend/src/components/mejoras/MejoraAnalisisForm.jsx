
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function MejoraAnalisisForm({ onSave, onCancel, isLoading }) {
  const [formData, setFormData] = React.useState({
    metodologia: "5-por-que",
    analisis_detallado: "",
    causas_identificadas: "",
    acciones_propuestas: "",
    responsable_analisis: "",
    fecha_analisis: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Metodología de Análisis</Label>
        <RadioGroup
          value={formData.metodologia}
          onValueChange={(value) => setFormData({ ...formData, metodologia: value })}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5-por-que" id="5-por-que" />
            <Label htmlFor="5-por-que">5 Por Qué</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ishikawa" id="ishikawa" />
            <Label htmlFor="ishikawa">Diagrama de Ishikawa</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pareto" id="pareto" />
            <Label htmlFor="pareto">Análisis de Pareto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="otro" id="otro" />
            <Label htmlFor="otro">Otro</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="analisis_detallado">Análisis Detallado</Label>
        <Textarea
          id="analisis_detallado"
          value={formData.analisis_detallado}
          onChange={(e) => setFormData({ ...formData, analisis_detallado: e.target.value })}
          required
          className="min-h-[150px]"
          placeholder="Describe el proceso de análisis realizado..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="causas_identificadas">Causas Identificadas</Label>
        <Textarea
          id="causas_identificadas"
          value={formData.causas_identificadas}
          onChange={(e) => setFormData({ ...formData, causas_identificadas: e.target.value })}
          required
          className="min-h-[100px]"
          placeholder="Lista las causas raíz identificadas..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="acciones_propuestas">Acciones Propuestas</Label>
        <Textarea
          id="acciones_propuestas"
          value={formData.acciones_propuestas}
          onChange={(e) => setFormData({ ...formData, acciones_propuestas: e.target.value })}
          required
          className="min-h-[100px]"
          placeholder="Describe las acciones propuestas para abordar las causas..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="responsable_analisis">Responsable del Análisis</Label>
          <Input
            id="responsable_analisis"
            value={formData.responsable_analisis}
            onChange={(e) => setFormData({ ...formData, responsable_analisis: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_analisis">Fecha del Análisis</Label>
          <Input
            id="fecha_analisis"
            type="date"
            value={formData.fecha_analisis}
            onChange={(e) => setFormData({ ...formData, fecha_analisis: e.target.value })}
            required
          />
        </div>
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
          {isLoading ? "Guardando..." : "Completar Análisis"}
        </Button>
      </div>
    </form>
  );
}

export default MejoraAnalisisForm;
