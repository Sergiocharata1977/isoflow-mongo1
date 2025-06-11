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

function ObjetivoCalidadModal({ isOpen, onClose, onSave, objetivo, procesos = [], apiError }) {
    const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    procesoId: "",
    responsable: "",
    fechaInicio: "",
    fechaFin: "",
    accionesPlaneadas: "",
    estado: "Activo"
  });

  
  const [error, setError] = useState("");

  useEffect(() => {
    const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : "";

    if (objetivo) {
      setFormData({
        nombre: objetivo.nombre || "",
        descripcion: objetivo.descripcion || "",
        procesoId: objetivo.procesoId?._id || objetivo.procesoId || "",
        responsable: objetivo.responsable || "",
        fechaInicio: formatDate(objetivo.fechaInicio),
        fechaFin: formatDate(objetivo.fechaFin),
        accionesPlaneadas: objetivo.accionesPlaneadas || "",
        estado: objetivo.estado || "Activo"
      });
    } else {
      // Reset form when creating new
      setFormData({
        nombre: "",
        descripcion: "",
        procesoId: "",
        responsable: "",
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: "",
        accionesPlaneadas: "",
        estado: "Activo"
      });
    }
    setError(""); // Limpiar errores al cambiar de objetivo
  }, [objetivo, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



    const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Limpiar error local

    if (!formData.nombre || !formData.procesoId || !formData.responsable || !formData.fechaInicio || !formData.fechaFin) {
      setError("Por favor complete todos los campos obligatorios (*).");
      return;
    }

    // Crear un objeto de datos limpio para enviar
    const dataToSend = {
      ...formData,
      procesoId: formData.procesoId === "" ? null : formData.procesoId,
    };

    onSave(dataToSend);
    // El onClose() se llamará desde el componente padre tras el guardado exitoso
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
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="col-span-3 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="procesoId" className="text-right">
                Proceso <span className="text-red-500">*</span>
              </Label>
              <select
                id="procesoId"
                name="procesoId"
                value={formData.procesoId}
                onChange={handleChange}
                className="col-span-3 border rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                required
              >
                <option value="" disabled>Seleccione un proceso</option>
                {procesos.map(proceso => (
                  <option key={proceso._id} value={proceso._id}>
                    {proceso.nombre}
                  </option>
                ))}
              </select>
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
                Fecha Inicio <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaFin" className="text-right">
                Fecha Fin <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="accionesPlaneadas" className="text-right mt-2">
                Acciones Planeadas
              </Label>
              <Textarea
                id="accionesPlaneadas"
                name="accionesPlaneadas"
                value={formData.accionesPlaneadas}
                onChange={handleChange}
                className="col-span-3 min-h-[80px]"
                placeholder="Describa las acciones para alcanzar el objetivo..."
              />
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
                className="col-span-3 border rounded-md px-3 py-2 bg-white dark:bg-gray-800"
              >
                <option value="Activo">Activo</option>
                <option value="En revisión">En revisión</option>
                <option value="Cumplido">Cumplido</option>
                <option value="No alcanzado">No alcanzado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {(error || apiError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error || apiError}</span>
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
