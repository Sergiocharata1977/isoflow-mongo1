import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductoModal = ({ isOpen, onClose, onSave, producto }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    fecha_inicio: "",
    area_responsable: "",
    cliente_objetivo: "",
    version: "",
    descripcion_tecnica: "",
    requisitos_cliente: "",
    normas_aplicables: "",
    origen_insumo: "",
    trazabilidad: "",
    requisitos_almacenamiento: "",
    fases_desarrollo: "",
    recursos_necesarios: "",
    matriz_riesgos: "",
    ensayos_necesarios: "",
    fecha_verificacion: "",
    ensayos_realizados: "",
    resultados_obtenidos: "",
    no_conformidades: "",
    acciones_correctivas: "",
    validacion_cliente: "",
    prueba_campo: "",
    resultado_validacion: "",
    observaciones: "",
    autorizacion_comercializar: "",
    documentos_adjuntos: "",
    estado: ""
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        ...producto
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="informacion" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="informacion">Información General</TabsTrigger>
              <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
              <TabsTrigger value="desarrollo">Desarrollo y Verificación</TabsTrigger>
              <TabsTrigger value="validacion">Validación y Documentación</TabsTrigger>
            </TabsList>

            {/* Pestaña 1: Información General */}
            <TabsContent value="informacion" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Producto/Servicio *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select 
                    value={formData.tipo || ""} 
                    onValueChange={(value) => handleSelectChange("tipo", value)}
                    required
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fertilizante">Fertilizante</SelectItem>
                      <SelectItem value="Semilla">Semilla</SelectItem>
                      <SelectItem value="Servicio de Tratamiento">Servicio de Tratamiento</SelectItem>
                      <SelectItem value="Acopio">Acopio</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
                  <Input
                    id="fecha_inicio"
                    name="fecha_inicio"
                    type="date"
                    value={formData.fecha_inicio || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area_responsable">Área Responsable</Label>
                  <Select 
                    value={formData.area_responsable || ""} 
                    onValueChange={(value) => handleSelectChange("area_responsable", value)}
                  >
                    <SelectTrigger id="area_responsable">
                      <SelectValue placeholder="Seleccionar área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Técnica">Técnica</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Logística">Logística</SelectItem>
                      <SelectItem value="Otra">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cliente_objetivo">Cliente objetivo</Label>
                  <Select 
                    value={formData.cliente_objetivo || ""} 
                    onValueChange={(value) => handleSelectChange("cliente_objetivo", value)}
                  >
                    <SelectTrigger id="cliente_objetivo">
                      <SelectValue placeholder="Seleccionar cliente objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agricultor">Agricultor</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                      <SelectItem value="Mayorista">Mayorista</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Versión del producto/servicio</Label>
                  <Input
                    id="version"
                    name="version"
                    value={formData.version || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={formData.estado || ""} 
                    onValueChange={(value) => handleSelectChange("estado", value)}
                  >
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Borrador">Borrador</SelectItem>
                      <SelectItem value="En desarrollo">En desarrollo</SelectItem>
                      <SelectItem value="En revisión">En revisión</SelectItem>
                      <SelectItem value="Aprobado">Aprobado</SelectItem>
                      <SelectItem value="Rechazado">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Pestaña 2: Requisitos */}
            <TabsContent value="requisitos" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descripcion_tecnica">Descripción Técnica del Producto o Servicio</Label>
                  <Textarea
                    id="descripcion_tecnica"
                    name="descripcion_tecnica"
                    value={formData.descripcion_tecnica || ""}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requisitos_cliente">Requisitos del Cliente</Label>
                  <Textarea
                    id="requisitos_cliente"
                    name="requisitos_cliente"
                    value={formData.requisitos_cliente || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Detallar los requisitos específicos del cliente o mercado objetivo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="normas_aplicables">Normas o Reglamentos Aplicables</Label>
                  <Textarea
                    id="normas_aplicables"
                    name="normas_aplicables"
                    value={formData.normas_aplicables || ""}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Ej. SENASA, INASE, ISO, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origen_insumo">Origen del insumo</Label>
                  <Input
                    id="origen_insumo"
                    name="origen_insumo"
                    value={formData.origen_insumo || ""}
                    onChange={handleChange}
                    placeholder="Si es de terceros, especificar"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trazabilidad">Trazabilidad esperada</Label>
                  <Input
                    id="trazabilidad"
                    name="trazabilidad"
                    value={formData.trazabilidad || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requisitos_almacenamiento">Requisitos de almacenamiento, conservación o aplicación</Label>
                  <Textarea
                    id="requisitos_almacenamiento"
                    name="requisitos_almacenamiento"
                    value={formData.requisitos_almacenamiento || ""}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Pestaña 3: Desarrollo y Verificación */}
            <TabsContent value="desarrollo" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fases_desarrollo">Fases de desarrollo o implementación</Label>
                  <Textarea
                    id="fases_desarrollo"
                    name="fases_desarrollo"
                    value={formData.fases_desarrollo || ""}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Formulación, prueba de campo, validación, comercialización"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recursos_necesarios">Recursos necesarios</Label>
                  <Textarea
                    id="recursos_necesarios"
                    name="recursos_necesarios"
                    value={formData.recursos_necesarios || ""}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Humanos, Equipos, Maquinarias, Transporte, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matriz_riesgos">Matriz de riesgos</Label>
                  <Textarea
                    id="matriz_riesgos"
                    name="matriz_riesgos"
                    value={formData.matriz_riesgos || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Identificación de riesgos y acciones preventivas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ensayos_necesarios">Necesidad de ensayos / pruebas / certificaciones previas</Label>
                  <Textarea
                    id="ensayos_necesarios"
                    name="ensayos_necesarios"
                    value={formData.ensayos_necesarios || ""}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_verificacion">Fecha de verificación técnica</Label>
                  <Input
                    id="fecha_verificacion"
                    name="fecha_verificacion"
                    type="date"
                    value={formData.fecha_verificacion || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ensayos_realizados">Ensayos realizados</Label>
                  <Textarea
                    id="ensayos_realizados"
                    name="ensayos_realizados"
                    value={formData.ensayos_realizados || ""}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Germinación, Residuales, Compatibilidad, Seguridad del operador"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resultados_obtenidos">Resultados obtenidos</Label>
                  <Textarea
                    id="resultados_obtenidos"
                    name="resultados_obtenidos"
                    value={formData.resultados_obtenidos || ""}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="no_conformidades">No Conformidades encontradas</Label>
                  <Textarea
                    id="no_conformidades"
                    name="no_conformidades"
                    value={formData.no_conformidades || ""}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="acciones_correctivas">Acciones correctivas implementadas</Label>
                  <Textarea
                    id="acciones_correctivas"
                    name="acciones_correctivas"
                    value={formData.acciones_correctivas || ""}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Pestaña 4: Validación y Documentación */}
            <TabsContent value="validacion" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validacion_cliente">Validación con cliente o mercado objetivo</Label>
                  <Textarea
                    id="validacion_cliente"
                    name="validacion_cliente"
                    value={formData.validacion_cliente || ""}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prueba_campo">Prueba de uso en campo o feedback de usuarios</Label>
                  <Textarea
                    id="prueba_campo"
                    name="prueba_campo"
                    value={formData.prueba_campo || ""}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resultado_validacion">Resultado de validación</Label>
                  <Select 
                    value={formData.resultado_validacion || ""} 
                    onValueChange={(value) => handleSelectChange("resultado_validacion", value)}
                  >
                    <SelectTrigger id="resultado_validacion">
                      <SelectValue placeholder="Seleccionar resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conforme">Conforme</SelectItem>
                      <SelectItem value="No conforme">No conforme</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones || ""}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autorizacion_comercializar">Autorización para comercializar / implementar servicio</Label>
                  <Select 
                    value={formData.autorizacion_comercializar || ""} 
                    onValueChange={(value) => handleSelectChange("autorizacion_comercializar", value)}
                  >
                    <SelectTrigger id="autorizacion_comercializar">
                      <SelectValue placeholder="Seleccionar autorización" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aprobado">Aprobado</SelectItem>
                      <SelectItem value="Rechazado">Rechazado</SelectItem>
                      <SelectItem value="En revisión">En revisión</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentos_adjuntos">Documentación y Registros Adjuntos</Label>
                  <Textarea
                    id="documentos_adjuntos"
                    name="documentos_adjuntos"
                    value={formData.documentos_adjuntos || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ficha técnica, Hoja de seguridad, Resultados de ensayo, Certificados, etc."
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {producto ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductoModal;
