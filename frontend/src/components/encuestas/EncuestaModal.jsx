
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

function EncuestaModal({ isOpen, onClose, onSave, encuesta }) {
  const [formData, setFormData] = useState({
    cliente: "",
    producto: "",
    satisfaccion_general: "Regular",
    atencion_empresa: "",
    tiempo_entrega: "",
    quejas: "",
    recomendaria_compra: true,
    sugerencias_mejoras: ""
  });

  useEffect(() => {
    if (encuesta) {
      setFormData(encuesta);
    } else {
      setFormData({
        cliente: "",
        producto: "",
        satisfaccion_general: "Regular",
        atencion_empresa: "",
        tiempo_entrega: "",
        quejas: "",
        recomendaria_compra: true,
        sugerencias_mejoras: ""
      });
    }
  }, [encuesta]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 mb-4 border-b">
          <DialogTitle>
            {encuesta ? "Editar Encuesta" : "Nueva Encuesta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pb-20">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="producto">Producto</Label>
              <Input
                id="producto"
                value={formData.producto}
                onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="satisfaccion_general">Satisfacción a nivel General</Label>
            <select
              id="satisfaccion_general"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.satisfaccion_general}
              onChange={(e) => setFormData({ ...formData, satisfaccion_general: e.target.value })}
              required
            >
              <option value="Malo">Malo</option>
              <option value="Regular">Regular</option>
              <option value="Bueno">Bueno</option>
              <option value="Muy Bueno">Muy Bueno</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="atencion_empresa">¿Cómo fue la atención dentro de la empresa?</Label>
            <Textarea
              id="atencion_empresa"
              value={formData.atencion_empresa}
              onChange={(e) => setFormData({ ...formData, atencion_empresa: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiempo_entrega">¿Cómo fue el tiempo de entrega de productos y servicios?</Label>
            <Textarea
              id="tiempo_entrega"
              value={formData.tiempo_entrega}
              onChange={(e) => setFormData({ ...formData, tiempo_entrega: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quejas">¿Tiene alguna queja que hacer?</Label>
            <Textarea
              id="quejas"
              value={formData.quejas}
              onChange={(e) => setFormData({ ...formData, quejas: e.target.value })}
              className="min-h-[100px]"
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.recomendaria_compra}
                onChange={(e) => setFormData({ ...formData, recomendaria_compra: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>¿Recomendaría la compra de productos o servicios?</span>
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sugerencias_mejoras">Sugerencias de mejoras</Label>
            <Textarea
              id="sugerencias_mejoras"
              value={formData.sugerencias_mejoras}
              onChange={(e) => setFormData({ ...formData, sugerencias_mejoras: e.target.value })}
              className="min-h-[100px]"
              placeholder="Opcional"
            />
          </div>
        </form>

        <DialogFooter className="sticky bottom-0 bg-background pt-4 mt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {encuesta ? "Guardar Cambios" : "Crear Encuesta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EncuestaModal;
