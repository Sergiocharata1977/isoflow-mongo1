
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

function DocumentoModal({ isOpen, onClose, onSave, documento }) {
  const [formData, setFormData] = useState({
    numero: "",
    titulo: "",
    version: "1.0",
    documento: "",
    procesos: "",
    archivo: null,
    archivoNombre: ""
  });

  const [procesos, setProcesos] = useState(() => {
    const saved = localStorage.getItem("procesos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (documento) {
      setFormData(documento);
    } else {
      // Generar número automático
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData({
        ...formData,
        numero: `D${year}${month}-${random}`,
        version: "1.0"
      });
    }
  }, [documento]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        archivo: file,
        archivoNombre: file.name
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {documento ? "Editar Documento" : "Nuevo Documento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número de Documento</Label>
              <Input
                id="numero"
                value={formData.numero}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versión</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                required
                placeholder="Ej: 1.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título del Documento</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="procesos">Proceso Relacionado</Label>
            <select
              id="procesos"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.procesos}
              onChange={(e) => setFormData({ ...formData, procesos: e.target.value })}
              required
            >
              <option value="">Seleccione un proceso</option>
              {procesos.map((proceso) => (
                <option key={proceso.id} value={proceso.titulo}>
                  {proceso.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documento">Contenido del Documento</Label>
            <Textarea
              id="documento"
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
              required
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="archivo">Archivo Adjunto</Label>
            <Input
              id="archivo"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {formData.archivoNombre && (
              <p className="text-sm text-muted-foreground mt-1">
                Archivo seleccionado: {formData.archivoNombre}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {documento ? "Guardar Cambios" : "Crear Documento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentoModal;
