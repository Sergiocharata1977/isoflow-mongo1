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
  ClipboardCheck, 
  Users, 
  Calendar,
  Star,
  Target,
  FileText,
  Briefcase,
  Building,
  User
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

function EvaluacionModal({ isOpen, onClose, onSave, evaluacion }) {
  const [formData, setFormData] = useState({
    empleado: "",
    puesto: "",
    departamento: "",
    evaluador: "",
    periodo: "",
    fechaEvaluacion: "",
    estado: "pendiente",
    calificacionGeneral: 0,
    fortalezas: "",
    areasOportunidad: "",
    comentarios: "",
    planesAccion: "",
    competencias: [
      { nombre: "Liderazgo", calificacion: 0, comentario: "" },
      { nombre: "Conocimiento técnico", calificacion: 0, comentario: "" },
      { nombre: "Comunicación", calificacion: 0, comentario: "" },
      { nombre: "Trabajo en equipo", calificacion: 0, comentario: "" },
      { nombre: "Resolución de problemas", calificacion: 0, comentario: "" }
    ],
    objetivos: [
      { descripcion: "", cumplimiento: 0, comentario: "" },
      { descripcion: "", cumplimiento: 0, comentario: "" },
      { descripcion: "", cumplimiento: 0, comentario: "" }
    ]
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

  const [puestos, setPuestos] = useState(() => {
    const saved = localStorage.getItem("puestos");
    const puestosData = saved ? JSON.parse(saved) : [];
    
    // Si no hay puestos, crear algunos por defecto
    if (puestosData.length === 0) {
      return [
        { id: 1, nombre: "Director General", departamento: "Dirección General" },
        { id: 2, nombre: "Gerente de Calidad", departamento: "Calidad" },
        { id: 3, nombre: "Gerente de RRHH", departamento: "Recursos Humanos" },
        { id: 4, nombre: "Gerente de Producción", departamento: "Producción" },
        { id: 5, nombre: "Coordinador de Capacitación", departamento: "Capacitación" },
        { id: 6, nombre: "Analista de Sistemas", departamento: "Sistemas" }
      ];
    }
    
    return puestosData;
  });

  useEffect(() => {
    if (evaluacion) {
      setFormData({
        ...evaluacion,
        competencias: evaluacion.competencias || formData.competencias,
        objetivos: evaluacion.objetivos || formData.objetivos
      });
    } else {
      setFormData({
        empleado: "",
        puesto: "",
        departamento: "",
        evaluador: "",
        periodo: "",
        fechaEvaluacion: new Date().toISOString().split('T')[0],
        estado: "pendiente",
        calificacionGeneral: 0,
        fortalezas: "",
        areasOportunidad: "",
        comentarios: "",
        planesAccion: "",
        competencias: [
          { nombre: "Liderazgo", calificacion: 0, comentario: "" },
          { nombre: "Conocimiento técnico", calificacion: 0, comentario: "" },
          { nombre: "Comunicación", calificacion: 0, comentario: "" },
          { nombre: "Trabajo en equipo", calificacion: 0, comentario: "" },
          { nombre: "Resolución de problemas", calificacion: 0, comentario: "" }
        ],
        objetivos: [
          { descripcion: "", cumplimiento: 0, comentario: "" },
          { descripcion: "", cumplimiento: 0, comentario: "" },
          { descripcion: "", cumplimiento: 0, comentario: "" }
        ]
      });
    }
  }, [evaluacion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calcular la calificación general basada en las competencias si el estado es "completada"
    let updatedFormData = { ...formData };
    
    if (updatedFormData.estado === "completada") {
      // Solo calcular si hay calificaciones de competencias
      const competenciasValidas = updatedFormData.competencias.filter(c => c.calificacion > 0);
      
      if (competenciasValidas.length > 0) {
        const sumaCalificaciones = competenciasValidas.reduce((sum, comp) => sum + comp.calificacion, 0);
        updatedFormData.calificacionGeneral = parseFloat((sumaCalificaciones / competenciasValidas.length).toFixed(1));
      }
    }
    
    onSave(updatedFormData);
  };

  const handleCompetenciaChange = (index, field, value) => {
    const updatedCompetencias = [...formData.competencias];
    updatedCompetencias[index] = {
      ...updatedCompetencias[index],
      [field]: field === 'calificacion' ? parseFloat(value) : value
    };
    setFormData({ ...formData, competencias: updatedCompetencias });
  };

  const handleObjetivoChange = (index, field, value) => {
    const updatedObjetivos = [...formData.objetivos];
    updatedObjetivos[index] = {
      ...updatedObjetivos[index],
      [field]: field === 'cumplimiento' ? parseInt(value) : value
    };
    setFormData({ ...formData, objetivos: updatedObjetivos });
  };

  const handlePuestoChange = (e) => {
    const selectedPuesto = e.target.value;
    setFormData({ ...formData, puesto: selectedPuesto });
    
    // Actualizar automáticamente el departamento basado en el puesto seleccionado
    const puestoInfo = puestos.find(p => p.nombre === selectedPuesto);
    if (puestoInfo) {
      setFormData(prev => ({ ...prev, departamento: puestoInfo.departamento }));
    }
  };

  const addCompetencia = () => {
    setFormData({
      ...formData,
      competencias: [
        ...formData.competencias,
        { nombre: "", calificacion: 0, comentario: "" }
      ]
    });
  };

  const removeCompetencia = (index) => {
    const updatedCompetencias = [...formData.competencias];
    updatedCompetencias.splice(index, 1);
    setFormData({ ...formData, competencias: updatedCompetencias });
  };

  const addObjetivo = () => {
    setFormData({
      ...formData,
      objetivos: [
        ...formData.objetivos,
        { descripcion: "", cumplimiento: 0, comentario: "" }
      ]
    });
  };

  const removeObjetivo = (index) => {
    const updatedObjetivos = [...formData.objetivos];
    updatedObjetivos.splice(index, 1);
    setFormData({ ...formData, objetivos: updatedObjetivos });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark max-w-xl w-full rounded-xl shadow-2xl border-border max-h-[90vh] overflow-y-auto bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">{evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general">Información General</TabsTrigger>
              <TabsTrigger value="competencias">Competencias</TabsTrigger>
              <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
              <TabsTrigger value="resultados">Resultados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empleado" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Empleado
                  </Label>
                  <Input
                    id="empleado"
                    value={formData.empleado}
                    onChange={(e) => setFormData({ ...formData, empleado: e.target.value })}
                    required
                    placeholder="Nombre del empleado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evaluador" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Evaluador
                  </Label>
                  <Input
                    id="evaluador"
                    value={formData.evaluador}
                    onChange={(e) => setFormData({ ...formData, evaluador: e.target.value })}
                    required
                    placeholder="Nombre del evaluador"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="puesto" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Puesto
                  </Label>
                  <select
                    id="puesto"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.puesto}
                    onChange={handlePuestoChange}
                    required
                  >
                    <option value="">Seleccione un puesto</option>
                    {puestos.map((puesto) => (
                      <option key={puesto.id} value={puesto.nombre}>
                        {puesto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodo" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Periodo
                  </Label>
                  <Input
                    id="periodo"
                    value={formData.periodo}
                    onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                    required
                    placeholder="Ej: Enero - Diciembre 2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaEvaluacion" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Evaluación
                  </Label>
                  <Input
                    id="fechaEvaluacion"
                    type="date"
                    value={formData.fechaEvaluacion}
                    onChange={(e) => setFormData({ ...formData, fechaEvaluacion: e.target.value })}
                    required
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
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en proceso">En proceso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="competencias" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Competencias a evaluar</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addCompetencia}
                >
                  Agregar competencia
                </Button>
              </div>
              
              {formData.competencias.map((competencia, index) => (
                <div key={index} className="space-y-4 p-4 border border-border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Competencia {index + 1}</h4>
                    {formData.competencias.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCompetencia(index)}
                        className="text-destructive"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`competencia-${index}-nombre`}>
                        Nombre de la competencia
                      </Label>
                      <Input
                        id={`competencia-${index}-nombre`}
                        value={competencia.nombre}
                        onChange={(e) => handleCompetenciaChange(index, 'nombre', e.target.value)}
                        required
                        placeholder="Ej: Liderazgo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`competencia-${index}-calificacion`}>
                        Calificación (1-5)
                      </Label>
                      <div className="flex items-center space-x-2">
                        <input
                          id={`competencia-${index}-calificacion`}
                          type="range"
                          min="0"
                          max="5"
                          step="0.5"
                          value={competencia.calificacion}
                          onChange={(e) => handleCompetenciaChange(index, 'calificacion', e.target.value)}
                          className="flex-1"
                        />
                        <div className="flex items-center space-x-1 min-w-[80px]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 cursor-pointer ${
                                star <= competencia.calificacion
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                              onClick={() => handleCompetenciaChange(index, 'calificacion', star)}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{competencia.calificacion}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`competencia-${index}-comentario`}>
                      Comentarios
                    </Label>
                    <Textarea
                      id={`competencia-${index}-comentario`}
                      value={competencia.comentario}
                      onChange={(e) => handleCompetenciaChange(index, 'comentario', e.target.value)}
                      placeholder="Comentarios sobre el desempeño en esta competencia"
                    />
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="objetivos" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Objetivos a evaluar</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addObjetivo}
                >
                  Agregar objetivo
                </Button>
              </div>
              
              {formData.objetivos.map((objetivo, index) => (
                <div key={index} className="space-y-4 p-4 border border-border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Objetivo {index + 1}</h4>
                    {formData.objetivos.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjetivo(index)}
                        className="text-destructive"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`objetivo-${index}-descripcion`}>
                      Descripción del objetivo
                    </Label>
                    <Input
                      id={`objetivo-${index}-descripcion`}
                      value={objetivo.descripcion}
                      onChange={(e) => handleObjetivoChange(index, 'descripcion', e.target.value)}
                      required
                      placeholder="Ej: Implementar sistema de gestión de calidad"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`objetivo-${index}-cumplimiento`}>
                        Porcentaje de cumplimiento (0-100%)
                      </Label>
                      <div className="flex items-center space-x-2">
                        <input
                          id={`objetivo-${index}-cumplimiento`}
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={objetivo.cumplimiento}
                          onChange={(e) => handleObjetivoChange(index, 'cumplimiento', e.target.value)}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium">{objetivo.cumplimiento}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`objetivo-${index}-comentario`}>
                        Comentarios
                      </Label>
                      <Input
                        id={`objetivo-${index}-comentario`}
                        value={objetivo.comentario}
                        onChange={(e) => handleObjetivoChange(index, 'comentario', e.target.value)}
                        placeholder="Comentarios sobre el cumplimiento"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="resultados" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fortalezas" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Fortalezas
                </Label>
                <Textarea
                  id="fortalezas"
                  value={formData.fortalezas}
                  onChange={(e) => setFormData({ ...formData, fortalezas: e.target.value })}
                  className="min-h-[100px]"
                  placeholder="Ingrese cada fortaleza en una línea separada..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada fortaleza en una línea separada.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="areasOportunidad" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Áreas de Oportunidad
                </Label>
                <Textarea
                  id="areasOportunidad"
                  value={formData.areasOportunidad}
                  onChange={(e) => setFormData({ ...formData, areasOportunidad: e.target.value })}
                  className="min-h-[100px]"
                  placeholder="Ingrese cada área de oportunidad en una línea separada..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada área de oportunidad en una línea separada.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comentarios" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Comentarios Generales
                </Label>
                <Textarea
                  id="comentarios"
                  value={formData.comentarios}
                  onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                  className="min-h-[100px]"
                  placeholder="Comentarios generales sobre el desempeño..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planesAccion" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Planes de Acción
                </Label>
                <Textarea
                  id="planesAccion"
                  value={formData.planesAccion}
                  onChange={(e) => setFormData({ ...formData, planesAccion: e.target.value })}
                  className="min-h-[100px]"
                  placeholder="Ingrese cada plan de acción en una línea separada..."
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese cada plan de acción en una línea separada.
                </p>
              </div>
              
              {formData.estado === "completada" && (
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Calificación General</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= formData.calificacionGeneral
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-bold">{formData.calificacionGeneral}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    La calificación general se calcula automáticamente como el promedio de las calificaciones de competencias.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {evaluacion ? "Guardar Cambios" : "Crear Evaluación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EvaluacionModal;
