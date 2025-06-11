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
import { 
  GraduationCap, 
  Users, 
  Calendar,
  Clock,
  MapPin,
  FileText,
  Target,
  CheckCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CapacitacionModal({ isOpen, onClose, onSave, capacitacion }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    instructor: "",
    departamento: "",
    duracion: "",
    fechaInicio: "",
    fechaFin: "",
    horario: "",
    lugar: "",
    modalidad: "Presencial",
    estado: "programada",
    cupoMaximo: "20",
    objetivos: "",
    contenido: "",
    evaluacion: ""
  });

  const [departamentos, setDepartamentos] = useState(() => {
    const saved = localStorage.getItem("departamentos");
    const deptData = saved ? JSON.parse(saved) : [];
    
    // Si no hay departamentos, crear algunos por defecto
    if (deptData.length === 0) {
      return [
        { id: 1, nombre: "Calidad" },
        { id: 2, nombre: "Recursos Humanos" },
        { id: 3, nombre: "Producción" },
        { id: 4, nombre: "Finanzas" },
        { id: 5, nombre: "Capacitación" },
        { id: 6, nombre: "Sistemas" }
      ];
    }
    
    return deptData;
  });

  useEffect(() => {
    if (capacitacion) {
      setFormData(capacitacion);
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        instructor: "",
        departamento: "",
        duracion: "",
        fechaInicio: "",
        fechaFin: "",
        horario: "",
        lugar: "",
        modalidad: "Presencial",
        estado: "programada",
        cupoMaximo: "20",
        objetivos: "",
        contenido: "",
        evaluacion: ""
      });
    }
  }, [capacitacion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark max-w-xl w-full rounded-xl shadow-2xl border-border max-h-[90vh] overflow-y-auto bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            {capacitacion ? "Editar Capacitación" : "Nueva Capacitación"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general">Información General</TabsTrigger>
              <TabsTrigger value="detalles">Detalles</TabsTrigger>
              <TabsTrigger value="contenido">Contenido</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Título de la Capacitación
                </Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                  placeholder="Ej: Introducción a ISO 9001:2015"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  className="min-h-[100px]"
                  placeholder="Describa el propósito y alcance de la capacitación..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Instructor
                  </Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                    placeholder="Nombre del instructor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
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
                  <Label htmlFor="estado" className="flex items-center gap-2">
                    Estado
                  </Label>
                  <select
                    id="estado"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    required
                  >
                    <option value="programada">Programada</option>
                    <option value="en curso">En curso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cupoMaximo" className="flex items-center gap-2">
                    Cupo Máximo
                  </Label>
                  <Input
                    id="cupoMaximo"
                    type="number"
                    min="1"
                    value={formData.cupoMaximo}
                    onChange={(e) => setFormData({ ...formData, cupoMaximo: e.target.value })}
                    required
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="detalles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Inicio
                  </Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFin" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Finalización
                  </Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracion" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duración
                  </Label>
                  <Input
                    id="duracion"
                    value={formData.duracion}
                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                    required
                    placeholder="Ej: 16 horas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horario
                  </Label>
                  <Input
                    id="horario"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    required
                    placeholder="Ej: 09:00 - 17:00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lugar" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Lugar
                  </Label>
                  <Input
                    id="lugar"
                    value={formData.lugar}
                    onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                    required
                    placeholder="Ej: Sala de Capacitación A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modalidad" className="flex items-center gap-2">
                    Modalidad
                  </Label>
                  <select
                    id="modalidad"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.modalidad}
                    onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                    required
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Online">Online</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contenido" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objetivos" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Objetivos
                </Label>
                <Textarea
                  id="objetivos"
                  value={formData.objetivos}
                  onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                  required
                  className="min-h-[150px]"
                  placeholder="Ingrese cada objetivo en una línea separada..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada objetivo en una línea separada.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenido" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Contenido
                </Label>
                <Textarea
                  id="contenido"
                  value={formData.contenido}
                  onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  required
                  className="min-h-[150px]"
                  placeholder="Ingrese cada tema o módulo en una línea separada..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada tema o módulo en una línea separada.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluacion" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Método de Evaluación
                </Label>
                <Input
                  id="evaluacion"
                  value={formData.evaluacion}
                  onChange={(e) => setFormData({ ...formData, evaluacion: e.target.value })}
                  required
                  placeholder="Ej: Examen final y trabajo práctico"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CapacitacionModal;
