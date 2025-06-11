
import React from "react";
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
import { Checkbox } from "../../components/ui/checkbox";
import { useState, useEffect } from "react";

function UsuarioModal({ isOpen, onClose, onSave, usuario }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "usuario",
    permisos: []
  });

  const menuSections = [
    { id: "tablero", name: "Tablero Central" },
    { id: "clientes", name: "Clientes" },
    { id: "personal", name: "Personal" },
    { id: "puestos", name: "Puestos" },
    { id: "departamentos", name: "Departamentos" },
    { id: "procesos", name: "Procesos" },
    { id: "objetivos", name: "Objetivos" },
    { id: "indicadores", name: "Indicadores" },
    { id: "mediciones", name: "Mediciones" },
    { id: "documentos", name: "Documentos" },
    { id: "norma", name: "Puntos de la Norma" },
    { id: "usuarios", name: "Usuarios" },
    { id: "configuracion", name: "Configuración" }
  ];

  useEffect(() => {
    if (usuario) {
      setFormData(usuario);
    } else {
      setFormData({
        nombre: "",
        email: "",
        password: "",
        rol: "usuario",
        permisos: []
      });
    }
  }, [usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePermissionChange = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      permisos: prev.permisos.includes(sectionId)
        ? prev.permisos.filter(p => p !== sectionId)
        : [...prev.permisos, sectionId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {usuario ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {!usuario && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!usuario}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <select
              id="rol"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Acceso a Secciones</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {menuSections.map((section) => (
                <div key={section.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={section.id}
                    checked={formData.permisos.includes(section.id)}
                    onCheckedChange={() => handlePermissionChange(section.id)}
                  />
                  <label
                    htmlFor={section.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {section.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {usuario ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UsuarioModal;
