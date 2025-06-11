import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

function DepartamentoModal({ isOpen, onClose, onSave, departamento, departamentos }) {
  const [formData, setFormData] = useState({
    nombre: "",
    responsable: "",
    descripcion: "",
    objetivos: "",
    departamentoPadreId: "",
    email: "",
    telefono: "",
    ubicacion: "",
    presupuesto: "",
    fechaCreacion: "",
    estado: "activo"
  });

  useEffect(() => {
    if (departamento) {
      setFormData({
        ...departamento,
        departamentoPadreId: departamento.departamentoPadreId || ""
      });
    } else {
      setFormData({
        nombre: "",
        responsable: "",
        descripcion: "",
        objetivos: "",
        departamentoPadreId: "",
        email: "",
        telefono: "",
        ubicacion: "",
        presupuesto: "",
        fechaCreacion: new Date().toISOString().split('T')[0],
        estado: "activo"
      });
    }
  }, [departamento]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const departamentosPadre = departamentos.filter(d => 
    d._id !== departamento?._id && !isDescendant(d._id, departamento?._id, departamentos)
  );

  function isDescendant(parentId, childId, deps) {
    if (!childId) return false;
    const child = deps.find(d => d._id === childId);
    if (!child) return false;
    if (child.departamentoPadreId === parentId) return true;
    return isDescendant(parentId, child.departamentoPadreId, deps);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {departamento ? "Editar Departamento" : "Nuevo Departamento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivos">Objetivos</Label>
            <Textarea
              id="objetivos"
              name="objetivos"
              value={formData.objetivos}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departamentoPadreId">Departamento Padre</Label>
              <Select
                value={formData.departamentoPadreId}
                onValueChange={(value) => handleSelectChange("departamentoPadreId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento padre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ninguno</SelectItem>
                  {departamentosPadre.map(dept => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleSelectChange("estado", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Input
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presupuesto">Presupuesto</Label>
              <Input
                id="presupuesto"
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaCreacion">Fecha de Creación</Label>
            <Input
              id="fechaCreacion"
              name="fechaCreacion"
              type="date"
              value={formData.fechaCreacion}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {departamento ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DepartamentoModal;
