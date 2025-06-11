
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

function ObjetivoModal({ isOpen, onClose, onSave, objetivo }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    responsable: "",
    procesos: ""
  });

  useEffect(() => {
    if (objetivo) {
      setFormData(objetivo);
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        responsable: "",
        procesos: ""
      });
    }
  }, [objetivo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {objetivo ? "Editar Objetivo" : "Nuevo Objetivo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
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
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
                className="min-h-[100px]"
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

            <div className="space-y-2">
              <Label htmlFor="procesos">Procesos</Label>
              <Input
                id="procesos"
                value={formData.procesos}
                onChange={(e) => setFormData({ ...formData, procesos: e.target.value })}
                required
                placeholder="Procesos relacionados"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {objetivo ? "Guardar Cambios" : "Crear Objetivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ObjetivoModal;
