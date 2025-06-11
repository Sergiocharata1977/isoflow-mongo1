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
import { 
  Building2, 
  Users, 
  Briefcase, 
  GraduationCap, 
  ClipboardList, 
  Shield, 
  Award, 
  Clock 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { departamentosService } from "../../services/departamentos";

function PuestoModal({ isOpen, onClose, onSave, puesto }) {
  const [formData, setFormData] = useState({
    nombre: "",
    departamento: "",
    supervisor: "",
    nivel: "",
    descripcion: "",
    requisitos: "",
    competencias: "",
    funciones: "",
    responsabilidades: "",
    experiencia: "",
    formacion: "",
    estado: "activo"
  });

  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    loadDepartamentos();
  }, []);

  useEffect(() => {
    if (puesto) {
      setFormData(puesto);
    } else {
      setFormData({
        nombre: "",
        departamento: "",
        supervisor: "",
        nivel: "",
        descripcion: "",
        requisitos: "",
        competencias: "",
        funciones: "",
        responsabilidades: "",
        experiencia: "",
        formacion: "",
        estado: "activo"
      });
    }
  }, [puesto]);

  const loadDepartamentos = async () => {
    try {
      const data = await departamentosService.getAll();
      setDepartamentos(data);
    } catch (error) {
      console.error("Error loading departamentos:", error);
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {puesto ? "Editar Puesto" : "Nuevo Puesto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="funciones">Funciones</TabsTrigger>
              <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
              <TabsTrigger value="competencias">Competencias</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Nombre del Puesto
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Gerente de Calidad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Departamento
                  </Label>
                  <select
                    id="departamento"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un departamento</option>
                    {departamentos.map((departamento) => (
                      <option key={departamento.id} value={departamento.nombre}>
                        {departamento.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supervisor" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Supervisor
                  </Label>
                  <Input
                    id="supervisor"
                    value={formData.supervisor}
                    onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                    required
                    placeholder="Ej: Director General"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nivel" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Nivel
                  </Label>
                  <select
                    id="nivel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.nivel}
                    onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un nivel</option>
                    <option value="Directivo">Directivo</option>
                    <option value="Gerencial">Gerencial</option>
                    <option value="Supervisión">Supervisión</option>
                    <option value="Operativo">Operativo</option>
                    <option value="Apoyo">Apoyo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Descripción del Puesto
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  className="min-h-[100px]"
                  placeholder="Describa las responsabilidades generales y el propósito del puesto..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="flex items-center gap-2">
                  Estado
                </Label>
                <select
                  id="estado"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </TabsContent>
            
            <TabsContent value="funciones" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="funciones" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Funciones
                </Label>
                <Textarea
                  id="funciones"
                  value={formData.funciones}
                  onChange={(e) => setFormData({ ...formData, funciones: e.target.value })}
                  required
                  className="min-h-[200px]"
                  placeholder="Lista las funciones principales (una por línea)..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada función en una línea separada. Ejemplo:
                  <br />
                  Desarrollar y mantener el SGC
                  <br />
                  Gestionar auditorías internas y externas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsabilidades" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Responsabilidades
                </Label>
                <Textarea
                  id="responsabilidades"
                  value={formData.responsabilidades}
                  onChange={(e) => setFormData({ ...formData, responsabilidades: e.target.value })}
                  required
                  className="min-h-[200px]"
                  placeholder="Lista las responsabilidades principales (una por línea)..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada responsabilidad en una línea separada.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="requisitos" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requisitos" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Requisitos
                </Label>
                <Textarea
                  id="requisitos"
                  value={formData.requisitos}
                  onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                  required
                  className="min-h-[150px]"
                  placeholder="Lista los requisitos necesarios para el puesto..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experiencia" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Experiencia Requerida
                  </Label>
                  <Input
                    id="experiencia"
                    value={formData.experiencia}
                    onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                    required
                    placeholder="Ej: 3 años en puestos similares"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formacion" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Formación Requerida
                  </Label>
                  <Input
                    id="formacion"
                    value={formData.formacion}
                    onChange={(e) => setFormData({ ...formData, formacion: e.target.value })}
                    required
                    placeholder="Ej: Licenciatura en Administración"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="competencias" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="competencias" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Competencias
                </Label>
                <Textarea
                  id="competencias"
                  value={formData.competencias}
                  onChange={(e) => setFormData({ ...formData, competencias: e.target.value })}
                  required
                  className="min-h-[200px]"
                  placeholder="Lista las competencias requeridas (una por línea)..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada competencia en una línea separada. Ejemplo:
                  <br />
                  Liderazgo
                  <br />
                  Pensamiento analítico
                  <br />
                  Orientación a resultados
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {puesto ? "Guardar Cambios" : "Crear Puesto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PuestoModal;
