import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, ArrowUpDown, Check, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ObjetivoCalidadModal from "./ObjetivoCalidadModal";
import { getObjetivosCalidad, deleteObjetivoCalidad } from "@/services/objetivos-calidad";

const ESTADOS = {
  en_progreso: { label: "En Progreso", color: "bg-blue-100 text-blue-800" },
  completado: { label: "Completado", color: "bg-green-100 text-green-800" },
  atrasado: { label: "Atrasado", color: "bg-red-100 text-red-800" },
  cancelado: { label: "Cancelado", color: "bg-gray-100 text-gray-800" },
};

export default function ObjetivosCalidadListing() {
  const [objetivos, setObjetivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "fechaCreacion", direction: "desc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentObjetivo, setCurrentObjetivo] = useState(null);
  const [error, setError] = useState("");

  // Cargar objetivos al montar el componente
  useEffect(() => {
    loadObjetivos();
  }, []);

  const loadObjetivos = async () => {
    try {
      setLoading(true);
      const data = await getObjetivosCalidad();
      setObjetivos(data);
    } catch (err) {
      console.error("Error al cargar objetivos de calidad:", err);
      setError("No se pudieron cargar los objetivos de calidad. Por favor, intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Manejar ordenación
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Aplicar ordenación
  const sortedObjetivos = React.useMemo(() => {
    const sortableItems = [...objetivos];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [objetivos, sortConfig]);

  // Filtrar por término de búsqueda
  const filteredObjetivos = sortedObjetivos.filter((objetivo) =>
    Object.values(objetivo).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Manejar edición
  const handleEdit = (objetivo) => {
    setCurrentObjetivo(objetivo);
    setIsModalOpen(true);
  };

  // Manejar eliminación
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este objetivo de calidad?")) {
      try {
        await deleteObjetivoCalidad(id);
        setObjetivos(objetivos.filter((obj) => obj._id !== id));
      } catch (err) {
        console.error("Error al eliminar el objetivo:", err);
        setError("No se pudo eliminar el objetivo. Por favor, intente de nuevo.");
      }
    }
  };

  // Manejar guardado exitoso
  const handleSaveSuccess = () => {
    setIsModalOpen(false);
    setCurrentObjetivo(null);
    loadObjetivos();
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP", { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  // Renderizar icono de ordenación
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUpDown className="ml-1 h-3 w-3" />
    ) : (
      <ArrowUpDown className="ml-1 h-3 w-3 transform rotate-180" />
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Objetivos de Calidad</CardTitle>
              <CardDescription>
                Gestión de objetivos de calidad del sistema
              </CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Objetivo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar objetivos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("nombre")}
                  >
                    <div className="flex items-center">
                      Nombre
                      {renderSortIcon("nombre")}
                    </div>
                  </TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("fechaInicio")}
                  >
                    <div className="flex items-center">
                      F. Inicio
                      {renderSortIcon("fechaInicio")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("fechaObjetivo")}
                  >
                    <div className="flex items-center">
                      F. Objetivo
                      {renderSortIcon("fechaObjetivo")}
                    </div>
                  </TableHead>
                  <TableHead>Indicadores</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredObjetivos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No se encontraron objetivos que coincidan con la búsqueda" : "No hay objetivos registrados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredObjetivos.map((objetivo) => (
                    <TableRow key={objetivo._id}>
                      <TableCell className="font-medium">
                        <div className="font-medium">{objetivo.nombre}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {objetivo.descripcion}
                        </div>
                      </TableCell>
                      <TableCell>{objetivo.responsable}</TableCell>
                      <TableCell>{formatDate(objetivo.fechaInicio)}</TableCell>
                      <TableCell>{formatDate(objetivo.fechaObjetivo)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {objetivo.indicadores?.slice(0, 2).map((indicador, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {indicador}
                            </Badge>
                          ))}
                          {objetivo.indicadores?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{objetivo.indicadores.length - 2} más
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${ESTADOS[objetivo.estado]?.color || 'bg-gray-100 text-gray-800'} whitespace-nowrap`}
                        >
                          {ESTADOS[objetivo.estado]?.label || objetivo.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(objetivo)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(objetivo._id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando <strong>{filteredObjetivos.length}</strong> de <strong>{objetivos.length}</strong> objetivos
          </div>
        </CardFooter>
      </Card>

      <ObjetivoCalidadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentObjetivo(null);
        }}
        onSave={handleSaveSuccess}
        objetivo={currentObjetivo}
      />
    </div>
  );
}
