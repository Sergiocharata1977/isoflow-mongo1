
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function MejoraVerificacionForm({ onSave, onCancel, isLoading }) {
  const [formData, setFormData] = React.useState({
    resultado_verificacion: "efectivo",
    metodo_verificacion: "",
    fecha_verificacion: "",
    responsable_verificacion: "",
    evidencias_eficacia: "",
    indicadores_medidos: "",
    conclusiones: "",
    recomendaciones: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Resultado de la Verificación</Label>
        <RadioGroup
          value={formData.resultado_verificacion}
          onValueChange={(value) => setFormData({ ...formData, resultado_verificacion: value })}
          className="grid grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="efectivo" id="efectivo" />
            <Label htmlFor="efectivo">Efectivo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="parcial" id="parcial" />
            <Label htmlFor="parcial">Parcialmente Efectivo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no-efectivo" id="no-efectivo" />
            <Label htmlFor="no-efectivo">No Efectivo</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metodo_verificacion">Método de Verificación</Label>
        <Textarea
          id="metodo_verificacion"
          value={formData.metodo_verificacion}
          onChange={(e) => setFormData({ ...formData, metodo_verificacion: e.target.value })}
          required
          placeholder="Describe el método utilizado para verificar la eficacia..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_verificacion">Fecha de Verificación</Label>
          <Input
            id="fecha_verificacion"
            type="date"
            value={formData.fecha_verificacion}
            onChange={(e) => setFormData({ ...formData, fecha_verificacion: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsable_verificacion">Responsable de Verificación</Label>
          <Input
            id="responsable_verificacion"
            value={formData.responsable_verificacion}
            onChange={(e) => setFormData({ ...formData, responsable_verificacion: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="evidencias_eficacia">Evidencias de Eficacia</Label>
        <Textarea
          id="evidencias_eficacia"
          value={formData.evidencias_eficacia}
          onChange={(e) => setFormData({ ...formData, evidencias_eficacia: e.target.value })}
          required
          placeholder="Documenta las evidencias que demuestran la eficacia..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="indicadores_medidos">Indicadores Medidos</Label>
        <Textarea
          id="indicadores_medidos"
          value={formData.indicadores_medidos}
          onChange={(e) => setFormData({ ...formData, indicadores_medidos: e.target.value })}
          required
          placeholder="Lista los indicadores medidos y sus resultados..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conclusiones">Conclusiones</Label>
        <Textarea
          id="conclusiones"
          value={formData.conclusiones}
          onChange={(e) => setFormData({ ...formData, conclusiones: e.target.value })}
          required
          placeholder="Describe las conclusiones de la verificación..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recomendaciones">Recomendaciones</Label>
        <Textarea
          id="recomendaciones"
          value={formData.recomendaciones}
          onChange={(e) => setFormData({ ...formData, recomendaciones: e.target.value })}
          placeholder="Proporciona recomendaciones si las hay..."
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
          {isLoading ? "Guardando..." : "Completar Verificación"}
        </Button>
      </div>
    </form>
  );
}

export default MejoraVerificacionForm;
