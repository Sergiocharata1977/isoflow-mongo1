
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

function MejoraModal({ isOpen, onClose, onSave, mejora }) {
  const [formData, setFormData] = useState({
    titulo: "",
    detalle: "",
    proceso: "",
    accion_inmediata: "",
    estado: "Hallazgo"
  });

  const estados = [
    'Hallazgo',
    'Corrección',
    'Análisis de Causas',
    'Acción Correctiva',
    'Acción Preventiva',
    'Planificación control',
    'Control Hecho'
  ];

  useEffect(() => {
    if (mejora) {
      setFormData(mejora);
    } else {
      setFormData({
        titulo: "",
        detalle: "",
        proceso: "",
        accion_inmediata: "",
        estado: "Hallazgo"
      });
    }
  }, [mejora]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mejora ? "Editar Mejora" : "Nueva Mejora"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              placeholder="Título de la mejora..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detalle">Detalle</Label>
            <Textarea
              id="detalle"
              value={formData.detalle}
              onChange={(e) => setFormData({ ...formData, detalle: e.target.value })}
              required
              className="min-h-[100px]"
              placeholder="Descripción detallada de la mejora..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proceso">Proceso</Label>
            <Input
              id="proceso"
              value={formData.proceso}
              onChange={(e) => setFormData({ ...formData, proceso: e.target.value })}
              required
              placeholder="Proceso relacionado..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accion_inmediata">Acción Inmediata</Label>
            <Textarea
              id="accion_inmediata"
              value={formData.accion_inmediata}
              onChange={(e) => setFormData({ ...formData, accion_inmediata: e.target.value })}
              required
              className="min-h-[100px]"
              placeholder="Acción inmediata a tomar..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <select
              id="estado"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              required
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {mejora ? "Guardar Cambios" : "Crear Mejora"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MejoraModal;
