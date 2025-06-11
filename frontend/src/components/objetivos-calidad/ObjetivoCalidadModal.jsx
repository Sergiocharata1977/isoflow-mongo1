import React, { useState, useEffect } from "react";
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

function ObjetivoCalidadModal({ isOpen, onClose, onSave, objetivo }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    responsable: "",
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaObjetivo: "",
    indicadores: [],
    estado: "en_progreso"
  });

  const [nuevoIndicador, setNuevoIndicador] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (objetivo) {
      setFormData({
        nombre: objetivo.nombre || "",
        descripcion: objetivo.descripcion || "",
        responsable: objetivo.responsable || "",
        fechaInicio: objetivo.fechaInicio || new Date().toISOString().split('T')[0],
        fechaObjetivo: objetivo.fechaObjetivo || "",
        indicadores: objetivo.indicadores || [],
        estado: objetivo.estado || "en_progreso"
      });
    } else {
      // Reset form when creating new
      setFormData({
        nombre: "",
        descripcion: "",
        responsable: "",
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaObjetivo: "",
        indicadores: [],
        estado: "en_progreso"
      });
    }
  }, [objetivo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddIndicador = () => {
    if (nuevoIndicador.trim()) {
      setFormData(prev => ({
        ...prev,
        indicadores: [...prev.indicadores, nuevoIndicador.trim()]
      }));
      setNuevoIndicador("");
    }
  };

  const handleRemoveIndicador = (index) => {
    setFormData(prev => ({
      ...prev,
      indicadores: prev.indicadores.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.descripcion || !formData.responsable) {
      setError("Por favor complete todos los campos obligatorios");
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {objetivo ? "Editar Objetivo de Calidad" : "Nuevo Objetivo de Calidad"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="descripcion" className="text-right mt-2">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="col-span-3 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsable" className="text-right">
                Responsable <span className="text-red-500">*</span>
              </Label>
              <Input
                id="responsable"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaInicio" className="text-right">
                Fecha Inicio
              </Label>
              <Input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaObjetivo" className="text-right">
                Fecha Objetivo
              </Label>
              <Input
                type="date"
                id="fechaObjetivo"
                name="fechaObjetivo"
                value={formData.fechaObjetivo}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Indicadores
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={nuevoIndicador}
                    onChange={(e) => setNuevoIndicador(e.target.value)}
                    placeholder="Nuevo indicador"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddIndicador}
                    variant="outline"
                  >
                    Agregar
                  </Button>
                </div>
                
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                  {formData.indicadores.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay indicadores</p>
                  ) : (
                    <ul className="space-y-1">
                      {formData.indicadores.map((indicador, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{indicador}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveIndicador(index)}
                            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                          >
                            ×
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="col-span-3 border rounded-md px-3 py-2"
              >
                <option value="en_progreso">En Progreso</option>
                <option value="completado">Completado</option>
                <option value="atrasado">Atrasado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}

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

export default ObjetivoCalidadModal;
