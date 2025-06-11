
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

function ProcesoModal({ isOpen, onClose, onSave, proceso }) {
  const [formData, setFormData] = useState({
    nombre: "",
    responsable: "",
    codigo: "",
    version: "1.0",
    objetivo: "",
    alcance: "",
    descripcion: "",
    imagen: null,
    imagenPreview: "",
    entradas: "",
    salidas: "",
    indicadores: "",
    estado: "activo"
  });

  useEffect(() => {
    if (proceso) {
      setFormData({
        ...proceso,
        imagenPreview: proceso.imagen ? URL.createObjectURL(proceso.imagen) : ""
      });
    } else {
      setFormData({
        nombre: "",
        responsable: "",
        codigo: "",
        version: "1.0",
        objetivo: "",
        alcance: "",
        descripcion: "",
        imagen: null,
        imagenPreview: "",
        entradas: "",
        salidas: "",
        indicadores: "",
        estado: "activo"
      });
    }
  }, [proceso]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: file,
        imagenPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {proceso ? "Editar Proceso" : "Nuevo Proceso"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Proceso</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                name="responsable"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versión</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="revision">En Revisión</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo</Label>
            <Textarea
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alcance">Alcance</Label>
            <Textarea
              id="alcance"
              value={formData.alcance}
              onChange={(e) => setFormData({ ...formData, alcance: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción Detallada</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagen">Esquema o Gráfico</Label>
            <Input
              id="imagen"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {formData.imagenPreview && (
              <div className="mt-2">
                <img
                  src={formData.imagenPreview}
                  alt="Vista previa del esquema"
                  className="max-h-48 rounded-md border border-border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entradas">Entradas</Label>
              <Textarea
                id="entradas"
                value={formData.entradas}
                onChange={(e) => setFormData({ ...formData, entradas: e.target.value })}
                required
                placeholder="Una entrada por línea"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salidas">Salidas</Label>
              <Textarea
                id="salidas"
                value={formData.salidas}
                onChange={(e) => setFormData({ ...formData, salidas: e.target.value })}
                required
                placeholder="Una salida por línea"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indicadores">Indicadores Relacionados</Label>
            <Textarea
              id="indicadores"
              value={formData.indicadores}
              onChange={(e) => setFormData({ ...formData, indicadores: e.target.value })}
              required
              placeholder="Un indicador por línea"
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {proceso ? "Guardar Cambios" : "Crear Proceso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProcesoModal;
