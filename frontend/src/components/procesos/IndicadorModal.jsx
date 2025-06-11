
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

function IndicadorModal({ isOpen, onClose, onSave, indicador }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    responsable: "",
    unidad_medida: "",
    limite_aceptacion: "",
    objetivo_calidad: ""
  });

  useEffect(() => {
    if (indicador) {
      setFormData(indicador);
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        responsable: "",
        unidad_medida: "",
        limite_aceptacion: "",
        objetivo_calidad: ""
      });
    }
  }, [indicador]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {indicador ? "Editar Indicador" : "Nuevo Indicador"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidad_medida">Unidad de Medida</Label>
              <Input
                id="unidad_medida"
                value={formData.unidad_medida}
                onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="limite_aceptacion">Límite de Aceptación</Label>
              <Input
                id="limite_aceptacion"
                type="number"
                value={formData.limite_aceptacion}
                onChange={(e) => setFormData({ ...formData, limite_aceptacion: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivo_calidad">Objetivo de Calidad</Label>
            <Textarea
              id="objetivo_calidad"
              value={formData.objetivo_calidad}
              onChange={(e) => setFormData({ ...formData, objetivo_calidad: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {indicador ? "Guardar Cambios" : "Crear Indicador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default IndicadorModal;
