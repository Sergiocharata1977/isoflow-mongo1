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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

function PersonalModal({ isOpen, onClose, onSave, person }) {
  const [formData, setFormData] = useState({
    numero: "",
    nombre: "",
    puesto: "",
    departamento: "",
    email: "",
    telefono: "",
    fechaIngreso: "",
    documentoIdentidad: "",
    direccion: "",
    formacionAcademica: [],
    experienciaLaboral: [],
    competencias: "",
    evaluacionDesempeno: "",
    capacitacionesRecibidas: "",
    observaciones: "",
    imagen: null
  });

  const departamentos = [
    "Calidad",
    "Producción",
    "Administración",
    "Recursos Humanos",
    "Marketing",
    "Finanzas",
    "Ventas",
    "Logística",
    "Tecnología",
    "Seguridad",
    "Medio Ambiente",
    "Auditoría"
  ];

  const puestos = {
    "Calidad": ["Gerente de Calidad", "Analista de Calidad", "Inspector de Calidad", "Auditor de Calidad"],
    "Producción": ["Gerente de Producción", "Supervisor de Producción", "Operario", "Técnico de Mantenimiento"],
    "Administración": ["Gerente Administrativo", "Asistente Administrativo", "Recepcionista"],
    "Recursos Humanos": ["Gerente de RRHH", "Analista de RRHH", "Especialista en Capacitación"],
    "Marketing": ["Gerente de Marketing", "Analista de Marketing", "Diseñador Gráfico"],
    "Finanzas": ["Director Financiero", "Contador", "Analista Financiero"],
    "Ventas": ["Gerente de Ventas", "Representante de Ventas", "Ejecutivo de Cuentas"],
    "Logística": ["Gerente de Logística", "Coordinador de Distribución", "Encargado de Almacén"],
    "Tecnología": ["Gerente de TI", "Desarrollador", "Analista de Sistemas", "Soporte Técnico"],
    "Seguridad": ["Jefe de Seguridad", "Especialista en HSE", "Técnico en Seguridad"],
    "Medio Ambiente": ["Responsable de Medio Ambiente", "Analista Ambiental"],
    "Auditoría": ["Auditor Interno", "Auditor Senior"]
  };

  useEffect(() => {
    if (person) {
      // Si estamos editando un registro existente
      setFormData({
        ...person,
        formacionAcademica: person.formacion_academica ? JSON.parse(person.formacion_academica) : [],
        experienciaLaboral: person.experiencia_laboral ? JSON.parse(person.experiencia_laboral) : [],
        fechaIngreso: person.fecha_ingreso || "",
        documentoIdentidad: person.documento_identidad || "",
        evaluacionDesempeno: person.evaluacion_desempeno || "",
        capacitacionesRecibidas: person.capacitaciones_recibidas || ""
      });
    } else {
      // Si estamos creando un nuevo registro
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      setFormData({
        ...formData,
        numero: `P${year}${month}-${random}`,
        fechaIngreso: new Date().toISOString().split('T')[0],
        formacionAcademica: [],
        experienciaLaboral: []
      });
    }
  }, [person]);

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

  const addFormacionAcademica = () => {
    setFormData(prev => ({
      ...prev,
      formacionAcademica: [
        ...prev.formacionAcademica,
        {
          titulo: "",
          institucion: "",
          anioFinalizacion: "",
          descripcion: ""
        }
      ]
    }));
  };

  const removeFormacionAcademica = (index) => {
    setFormData(prev => ({
      ...prev,
      formacionAcademica: prev.formacionAcademica.filter((_, i) => i !== index)
    }));
  };

  const updateFormacionAcademica = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      formacionAcademica: prev.formacionAcademica.map((formacion, i) => 
        i === index ? { ...formacion, [field]: value } : formacion
      )
    }));
  };

  const addExperienciaLaboral = () => {
    setFormData(prev => ({
      ...prev,
      experienciaLaboral: [
        ...prev.experienciaLaboral,
        {
          empresa: "",
          puesto: "",
          fechaInicio: "",
          fechaFin: "",
          descripcion: ""
        }
      ]
    }));
  };

  const removeExperienciaLaboral = (index) => {
    setFormData(prev => ({
      ...prev,
      experienciaLaboral: prev.experienciaLaboral.filter((_, i) => i !== index)
    }));
  };

  const updateExperienciaLaboral = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experienciaLaboral: prev.experienciaLaboral.map((experiencia, i) => 
        i === index ? { ...experiencia, [field]: value } : experiencia
      )
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagen: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preparar los datos para guardar
    const dataToSave = {
      ...formData,
      formacion_academica: JSON.stringify(formData.formacionAcademica),
      experiencia_laboral: JSON.stringify(formData.experienciaLaboral),
      fecha_ingreso: formData.fechaIngreso,
      documento_identidad: formData.documentoIdentidad,
      evaluacion_desempeno: formData.evaluacionDesempeno,
      capacitaciones_recibidas: formData.capacitacionesRecibidas
    };
    
    onSave(dataToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {person ? `Editar: ${person.nombre}` : "Nuevo Personal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda - Información básica */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                  <Input
                    id="fechaIngreso"
                    name="fechaIngreso"
                    type="date"
                    value={formData.fechaIngreso}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select
                    value={formData.departamento}
                    onValueChange={(value) => handleSelectChange("departamento", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map(depto => (
                        <SelectItem key={depto} value={depto}>{depto}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="puesto">Puesto</Label>
                  <Select
                    value={formData.puesto}
                    onValueChange={(value) => handleSelectChange("puesto", value)}
                    disabled={!formData.departamento}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.departamento && puestos[formData.departamento]?.map(puesto => (
                        <SelectItem key={puesto} value={puesto}>{puesto}</SelectItem>
                      ))}
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
                  <Label htmlFor="documentoIdentidad">Documento de Identidad</Label>
                  <Input
                    id="documentoIdentidad"
                    name="documentoIdentidad"
                    value={formData.documentoIdentidad}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imagen">Foto</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      id="imagen"
                      name="imagen"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                  </div>
                  <div className="flex justify-center">
                    {(formData.imagen || person?.imagen) && (
                      <div className="h-20 w-20 rounded-full overflow-hidden border">
                        <img 
                          src={formData.imagen || person?.imagen} 
                          alt="Vista previa" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Información adicional */}
            <div>
              <Tabs defaultValue="competencias" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="competencias">Competencias</TabsTrigger>
                  <TabsTrigger value="formacion">Formación</TabsTrigger>
                  <TabsTrigger value="experiencia">Experiencia</TabsTrigger>
                </TabsList>

                <TabsContent value="competencias" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="competencias">Competencias</Label>
                    <Textarea
                      id="competencias"
                      name="competencias"
                      value={formData.competencias}
                      onChange={handleChange}
                      placeholder="Habilidades y competencias clave..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluacionDesempeno">Evaluación de Desempeño</Label>
                    <Select
                      value={formData.evaluacionDesempeno}
                      onValueChange={(value) => handleSelectChange("evaluacionDesempeno", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sobresaliente">Sobresaliente</SelectItem>
                        <SelectItem value="Muy bueno">Muy bueno</SelectItem>
                        <SelectItem value="Bueno">Bueno</SelectItem>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Necesita mejorar">Necesita mejorar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacitacionesRecibidas">Capacitaciones Recibidas</Label>
                    <Textarea
                      id="capacitacionesRecibidas"
                      name="capacitacionesRecibidas"
                      value={formData.capacitacionesRecibidas}
                      onChange={handleChange}
                      placeholder="Cursos y certificaciones obtenidas..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      placeholder="Observaciones adicionales..."
                      className="min-h-[100px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="formacion" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Formación Académica</h3>
                    <Button type="button" onClick={addFormacionAcademica} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Formación
                    </Button>
                  </div>

                  {formData.formacionAcademica.map((formacion, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">Formación #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFormacionAcademica(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Título</Label>
                          <Input
                            value={formacion.titulo}
                            onChange={(e) => updateFormacionAcademica(index, 'titulo', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Institución</Label>
                          <Input
                            value={formacion.institucion}
                            onChange={(e) => updateFormacionAcademica(index, 'institucion', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Año de Finalización</Label>
                          <Input
                            value={formacion.anioFinalizacion}
                            onChange={(e) => updateFormacionAcademica(index, 'anioFinalizacion', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Input
                          value={formacion.descripcion}
                          onChange={(e) => updateFormacionAcademica(index, 'descripcion', e.target.value)}
                          placeholder="Descripción adicional..."
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="experiencia" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Experiencia Laboral</h3>
                    <Button type="button" onClick={addExperienciaLaboral} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Experiencia
                    </Button>
                  </div>

                  {formData.experienciaLaboral.map((experiencia, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">Experiencia #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperienciaLaboral(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Empresa</Label>
                          <Input
                            value={experiencia.empresa}
                            onChange={(e) => updateExperienciaLaboral(index, 'empresa', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Puesto</Label>
                          <Input
                            value={experiencia.puesto}
                            onChange={(e) => updateExperienciaLaboral(index, 'puesto', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Fecha de Inicio</Label>
                          <Input
                            type="date"
                            value={experiencia.fechaInicio}
                            onChange={(e) => updateExperienciaLaboral(index, 'fechaInicio', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha de Fin</Label>
                          <Input
                            type="date"
                            value={experiencia.fechaFin}
                            onChange={(e) => updateExperienciaLaboral(index, 'fechaFin', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea
                          value={experiencia.descripcion}
                          onChange={(e) => updateExperienciaLaboral(index, 'descripcion', e.target.value)}
                          placeholder="Descripción de responsabilidades..."
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {person ? "Guardar Cambios" : "Crear Personal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PersonalModal;
