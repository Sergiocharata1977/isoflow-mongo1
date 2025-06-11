import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Briefcase, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  MapPin,
  Award,
  BookOpen,
  ChevronDown,
  ChevronRight
} from "lucide-react";

function PersonalSingle({ person, onBack, onEdit, onDelete }) {
  const [expandedSections, setExpandedSections] = useState({
    formacion: false,
    experiencia: false,
    competencias: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Parsear los datos de formación académica y experiencia laboral
  const formacionAcademica = person.formacion_academica ? JSON.parse(person.formacion_academica) : [];
  const experienciaLaboral = person.experiencia_laboral ? JSON.parse(person.experiencia_laboral) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{person.nombre}</h1>
          {person.numero && (
            <Badge variant="outline" className="ml-3">
              {person.numero}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(person)}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(person._id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda - Información principal */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Foto de perfil */}
                <div className="flex-shrink-0">
                  <div className="h-40 w-40 rounded-lg overflow-hidden border">
                    <img
                      src={person.imagen || "/images/personal/v3_0277343.jpg"}
                      alt={person.nombre}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/images/personal/v3_0277343.jpg";
                      }}
                    />
                  </div>
                </div>

                {/* Detalles personales */}
                <div className="flex flex-col space-y-4 flex-grow">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Puesto</p>
                      <p className="font-medium">{person.puesto || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <User className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Departamento</p>
                      <p className="font-medium">{person.departamento || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{person.email || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{person.telefono || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                      <p className="font-medium">{person.fecha_ingreso || "No especificada"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                {person.documento_identidad && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Documento de Identidad</p>
                    <p>{person.documento_identidad}</p>
                  </div>
                )}

                {person.direccion && (
                  <div>
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                      <p className="text-sm text-muted-foreground">Dirección</p>
                    </div>
                    <p>{person.direccion}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sección de competencias */}
          <Card>
            <CardContent className="p-6">
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleSection('competencias')}
              >
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-muted-foreground mr-2" />
                  <h2 className="text-xl font-semibold">Competencias y Evaluación</h2>
                </div>
                {expandedSections.competencias ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </div>

              {expandedSections.competencias && (
                <div className="mt-4 space-y-4">
                  {person.competencias && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Competencias</p>
                      <p className="whitespace-pre-line">{person.competencias}</p>
                    </div>
                  )}

                  <Separator />

                  {person.evaluacion_desempeno && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Evaluación de Desempeño</p>
                      <Badge variant={
                        person.evaluacion_desempeno === "Sobresaliente" ? "success" :
                        person.evaluacion_desempeno === "Muy bueno" ? "default" :
                        person.evaluacion_desempeno === "Bueno" ? "secondary" :
                        person.evaluacion_desempeno === "Regular" ? "outline" :
                        "destructive"
                      }>
                        {person.evaluacion_desempeno}
                      </Badge>
                    </div>
                  )}

                  {person.capacitaciones_recibidas && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Capacitaciones Recibidas</p>
                      <p className="whitespace-pre-line">{person.capacitaciones_recibidas}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sección de formación académica */}
          {formacionAcademica.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div 
                  className="flex items-center justify-between cursor-pointer" 
                  onClick={() => toggleSection('formacion')}
                >
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-muted-foreground mr-2" />
                    <h2 className="text-xl font-semibold">Formación Académica</h2>
                  </div>
                  {expandedSections.formacion ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>

                {expandedSections.formacion && (
                  <div className="mt-4 space-y-4">
                    {formacionAcademica.map((formacion, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <div>
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{formacion.titulo}</h3>
                            <p className="text-sm text-muted-foreground">{formacion.anioFinalizacion}</p>
                          </div>
                          <p className="text-muted-foreground">{formacion.institucion}</p>
                          {formacion.descripcion && (
                            <p className="mt-2">{formacion.descripcion}</p>
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sección de experiencia laboral */}
          {experienciaLaboral.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div 
                  className="flex items-center justify-between cursor-pointer" 
                  onClick={() => toggleSection('experiencia')}
                >
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
                    <h2 className="text-xl font-semibold">Experiencia Laboral</h2>
                  </div>
                  {expandedSections.experiencia ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>

                {expandedSections.experiencia && (
                  <div className="mt-4 space-y-4">
                    {experienciaLaboral.map((experiencia, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <div>
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{experiencia.puesto}</h3>
                            <p className="text-sm text-muted-foreground">
                              {experiencia.fechaInicio} - {experiencia.fechaFin || "Actual"}
                            </p>
                          </div>
                          <p className="text-muted-foreground">{experiencia.empresa}</p>
                          {experiencia.descripcion && (
                            <p className="mt-2">{experiencia.descripcion}</p>
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna derecha - Información adicional */}
        <div className="space-y-6">
          {person.observaciones && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Observaciones</h2>
                <p className="whitespace-pre-line">{person.observaciones}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default PersonalSingle;
