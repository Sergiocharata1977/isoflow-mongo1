
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function MejoraCierreForm({ onSave, onCancel, isLoading }) {
  const [formData, setFormData] = React.useState({
    fecha_cierre: "",
    responsable_cierre: "",
    resultados_finales: "",
    lecciones_aprendidas: "",
    documentacion_actualizada: "",
    acciones_pendientes: "",
    comentarios_cierre: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_cierre">Fecha de Cierre</Label>
          <Input
            id="fecha_cierre"
            type="date"
            value={formData.fecha_cierre}
            onChange={(e) => setFormData({ ...formData, fecha_cierre: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsable_cierre">Responsable del Cierre</Label>
          <Input
            id="responsable_cierre"
            value={formData.responsable_cierre}
            onChange={(e) => setFormData({ ...formData, responsable_cierre: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resultados_finales">Resultados Finales</Label>
        <Textarea
          id="resultados_finales"
          value={formData.resultados_finales}
          onChange={(e) => setFormData({ ...formData, resultados_finales: e.target.value })}
          required
          className="min-h-[100px]"
          placeholder="Describe los resultados finales alcanzados..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lecciones_aprendidas">Lecciones Aprendidas</Label>
        <Textarea
          id="lecciones_aprendidas"
          value={formData.lecciones_aprendidas}
          onChange={(e) => setFormData({ ...formData, lecciones_aprendidas: e.target.value })}
          required
          placeholder="Documenta las lecciones aprendidas durante el proceso..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="documentacion_actualizada">Documentación Actualizada</Label>
        <Textarea
          id="documentacion_actualizada"
          value={formData.documentacion_actualizada}
          onChange={(e) => setFormData({ ...formData, documentacion_actualizada: e.target.value })}
          required
          placeholder="Lista la documentación que fue actualizada..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="acciones_pendientes">Acciones Pendientes</Label>
        <Textarea
          id="acciones_pendientes"
          value={formData.acciones_pendientes}
          onChange={(e) => setFormData({ ...formData, acciones_pendientes: e.target.value })}
          placeholder="Documenta cualquier acción pendiente o seguimiento requerido..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comentarios_cierre">Comentarios de Cierre</Label>
        <Textarea
          id="comentarios_cierre"
          value={formData.comentarios_cierre}
          onChange={(e) => setFormData({ ...formData, comentarios_cierre: e.target.value })}
          placeholder="Añade comentarios finales relevantes..."
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
          {isLoading ? "Guardando..." : "Completar Cierre"}
        </Button>
      </div>
    </form>
  );
}

export default MejoraCierreForm;
