
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function MejoraRegistroForm({ onSave, onCancel, isLoading }) {
  const [formData, setFormData] = React.useState({
    descripcion: "",
    ubicacion: "",
    fecha_deteccion: new Date().toISOString().split('T')[0],
    responsable_deteccion: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción detallada del problema</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          required
          className="min-h-[100px]"
          placeholder="Describe detalladamente la no conformidad o la oportunidad de mejora..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Input
            id="ubicacion"
            value={formData.ubicacion}
            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
            required
            placeholder="Área o departamento donde se detectó"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_deteccion">Fecha de Detección</Label>
          <Input
            id="fecha_deteccion"
            type="date"
            value={formData.fecha_deteccion}
            onChange={(e) => setFormData({ ...formData, fecha_deteccion: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsable_deteccion">Responsable de la Detección</Label>
        <Input
          id="responsable_deteccion"
          value={formData.responsable_deteccion}
          onChange={(e) => setFormData({ ...formData, responsable_deteccion: e.target.value })}
          required
          placeholder="Nombre de la persona que detectó la situación"
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
          {isLoading ? "Guardando..." : "Guardar Registro"}
        </Button>
      </div>
    </form>
  );
}

export default MejoraRegistroForm;
