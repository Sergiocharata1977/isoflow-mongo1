import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@libsql/client";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  LineChart,
  ArrowLeft,
  TrendingUp,
  Calendar
} from "lucide-react";
import MedicionModal from "./MedicionModal";

// Cliente de Turso
const client = createClient({
  url: "libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ"
});

function MedicionesListing({ indicadorId, indicadorTitulo, objetivoId, objetivoTitulo, procesoId, procesoNombre, onBack }) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicion, setSelectedMedicion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mediciones, setMediciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMediciones();
  }, [indicadorId]);

  const loadMediciones = async () => {
    try {
      setIsLoading(true);
      
      // Intentar cargar desde Turso
      try {
        const result = await client.execute({
          sql: "SELECT * FROM mediciones WHERE indicador_id = ?",
          args: [indicadorId]
        });
        
        if (result.rows.length > 0) {
          setMediciones(result.rows);
          setIsLoading(false);
          return;
        }
      } catch (dbError) {
        console.error("Error al cargar desde Turso:", dbError);
      }
      
      // Intentar cargar desde localStorage
      const saved = localStorage.getItem("mediciones");
      let data = saved ? JSON.parse(saved) : [];
      
      // Filtrar por indicadorId si está definido
      if (indicadorId) {
        data = data.filter(m => m.indicador_id === indicadorId);
      }
      
      // Si hay datos en localStorage, intentar sincronizarlos con Turso
      if (data.length > 0) {
        try {
          for (const medicion of data) {
            await client.execute({
              sql: `INSERT OR REPLACE INTO mediciones 
                    (id, titulo, fecha, medicion, comentarios, indicador_id, indicador_titulo, 
                     objetivo_id, proceso_id, valor_numerico, estado) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                medicion.id, 
                medicion.titulo, 
                medicion.fecha || '', 
                medicion.medicion || '', 
                medicion.comentarios || '', 
                medicion.indicador_id || null, 
                medicion.indicador_titulo || '', 
                medicion.objetivo_id || null, 
                medicion.proceso_id || null, 
                medicion.valor_numerico || 0, 
                medicion.estado || ''
              ]
            });
          }
          
          // Recargar desde Turso después de sincronizar
          const syncResult = await client.execute({
            sql: "SELECT * FROM mediciones WHERE indicador_id = ?",
            args: [indicadorId]
          });
          
          if (syncResult.rows.length > 0) {
            setMediciones(syncResult.rows);
          } else {
            setMediciones(data);
          }
        } catch (syncError) {
          console.error("Error al sincronizar con Turso:", syncError);
          setMediciones(data);
        }
      } else if (data.length === 0) {
        // Si no hay datos, crear datos de muestra solo si no hay datos en Turso
        const mockData = [
          {
            id: 1,
            titulo: "Medición Enero 2025",
            fecha: "2025-01-15",
            medicion: "52 min",
            comentarios: "Por encima del límite aceptable. Se implementarán mejoras en el proceso.",
            indicador_id: 1,
            indicador_titulo: "Tiempo medio de producción",
            objetivo_id: 1,
            proceso_id: 1,
            valor_numerico: 52,
            estado: "No conforme"
          },
          {
            id: 2,
            titulo: "Medición Febrero 2025",
            fecha: "2025-02-15",
            medicion: "48 min",
            comentarios: "Mejora respecto al mes anterior pero aún por encima del límite.",
            indicador_id: 1,
            indicador_titulo: "Tiempo medio de producción",
            objetivo_id: 1,
            proceso_id: 1,
            valor_numerico: 48,
            estado: "No conforme"
          },
          {
            id: 3,
            titulo: "Medición Marzo 2025",
            fecha: "2025-03-15",
            medicion: "43 min",
            comentarios: "Se ha alcanzado el objetivo de reducción de tiempo.",
            indicador_id: 1,
            indicador_titulo: "Tiempo medio de producción",
            objetivo_id: 1,
            proceso_id: 1,
            valor_numerico: 43,
            estado: "Conforme"
          },
          {
            id: 4,
            titulo: "Medición Enero 2025",
            fecha: "2025-01-31",
            medicion: "2.8%",
            comentarios: "Por encima del límite aceptable. Se requiere revisar el control de calidad.",
            indicador_id: 2,
            indicador_titulo: "Tasa de defectos",
            objetivo_id: 2,
            proceso_id: 1,
            valor_numerico: 2.8,
            estado: "No conforme"
          },
          {
            id: 5,
            titulo: "Medición Febrero 2025",
            fecha: "2025-02-28",
            medicion: "1.9%",
            comentarios: "Mejora significativa tras implementar nuevos controles.",
            indicador_id: 2,
            indicador_titulo: "Tasa de defectos",
            objetivo_id: 2,
            proceso_id: 1,
            valor_numerico: 1.9,
            estado: "Conforme"
          },
          {
            id: 6,
            titulo: "Medición Enero 2025",
            fecha: "2025-01-31",
            medicion: "7 días",
            comentarios: "Por encima del límite aceptable. Se requiere optimizar el proceso de compras.",
            indicador_id: 3,
            indicador_titulo: "Tiempo de entrega de materiales",
            objetivo_id: 3,
            proceso_id: 2,
            valor_numerico: 7,
            estado: "No conforme"
          },
          {
            id: 7,
            titulo: "Primer Trimestre 2025",
            fecha: "2025-03-31",
            medicion: "65%",
            comentarios: "Por debajo del objetivo del 80%. Se requieren acciones correctivas.",
            indicador_id: 4,
            indicador_titulo: "Satisfacción del cliente",
            objetivo_id: 4,
            proceso_id: 3,
            valor_numerico: 65,
            estado: "No conforme"
          }
        ];
        
        // Filtrar datos de muestra por indicadorId si está definido
        const filteredMockData = indicadorId ? mockData.filter(m => m.indicador_id === indicadorId) : mockData;
        
        try {
          // Intentar guardar los datos de muestra en Turso
          for (const medicion of filteredMockData) {
            await client.execute({
              sql: `INSERT OR REPLACE INTO mediciones 
                    (id, titulo, fecha, medicion, comentarios, indicador_id, indicador_titulo, 
                     objetivo_id, proceso_id, valor_numerico, estado) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                medicion.id, 
                medicion.titulo, 
                medicion.fecha || '', 
                medicion.medicion || '', 
                medicion.comentarios || '', 
                medicion.indicador_id || null, 
                medicion.indicador_titulo || '', 
                medicion.objetivo_id || null, 
                medicion.proceso_id || null, 
                medicion.valor_numerico || 0, 
                medicion.estado || ''
              ]
            });
          }
          
          // Guardar en localStorage como respaldo
          localStorage.setItem("mediciones", JSON.stringify(mockData));
          
          setMediciones(filteredMockData);
        } catch (mockError) {
          console.error("Error al guardar datos de muestra en Turso:", mockError);
          // Si falla, usar los datos de muestra directamente
          localStorage.setItem("mediciones", JSON.stringify(mockData));
          setMediciones(filteredMockData);
        }
      } else {
        setMediciones([]);
      }
    } catch (error) {
      console.error("Error al cargar mediciones:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las mediciones",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (medicionData) => {
    try {
      let updatedMediciones;
      const newId = selectedMedicion ? selectedMedicion.id : Date.now();
      const newMedicion = { 
        ...medicionData, 
        id: newId,
        indicador_id: indicadorId,
        indicador_titulo: indicadorTitulo
      };
      
      // Intentar guardar en Turso
      try {
        await client.execute({
          sql: `INSERT OR REPLACE INTO mediciones 
                (id, titulo, fecha, medicion, comentarios, indicador_id, indicador_titulo, 
                 objetivo_id, proceso_id, valor_numerico, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            newMedicion.id, 
            newMedicion.titulo, 
            newMedicion.fecha || '', 
            newMedicion.medicion || '', 
            newMedicion.comentarios || '', 
            newMedicion.indicador_id || null, 
            newMedicion.indicador_titulo || '', 
            objetivoId || null, 
            procesoId || null, 
            newMedicion.valor_numerico || 0, 
            newMedicion.estado || ''
          ]
        });
        
        // Recargar mediciones desde Turso
        const result = await client.execute({
          sql: "SELECT * FROM mediciones WHERE indicador_id = ?",
          args: [indicadorId]
        });
        
        if (result.rows.length > 0) {
          updatedMediciones = result.rows;
          
          // Actualizar localStorage como respaldo
          const saved = localStorage.getItem("mediciones");
          let allMediciones = saved ? JSON.parse(saved) : [];
          
          if (selectedMedicion) {
            allMediciones = allMediciones.map(m => 
              m.id === selectedMedicion.id ? newMedicion : m
            );
          } else {
            allMediciones.push(newMedicion);
          }
          
          localStorage.setItem("mediciones", JSON.stringify(allMediciones));
        }
      } catch (dbError) {
        console.error("Error al guardar en Turso:", dbError);
        
        // Fallback a localStorage
        const saved = localStorage.getItem("mediciones");
        let allMediciones = saved ? JSON.parse(saved) : [];
        
        if (selectedMedicion) {
          allMediciones = allMediciones.map(m => 
            m.id === selectedMedicion.id ? newMedicion : m
          );
          updatedMediciones = mediciones.map(m => 
            m.id === selectedMedicion.id ? newMedicion : m
          );
        } else {
          allMediciones.push(newMedicion);
          updatedMediciones = [...mediciones, newMedicion];
        }
        
        localStorage.setItem("mediciones", JSON.stringify(allMediciones));
      }
      
      setMediciones(updatedMediciones);
      setIsModalOpen(false);
      setSelectedMedicion(null);
      
      toast({
        title: selectedMedicion ? "Medición actualizada" : "Medición creada",
        description: selectedMedicion 
          ? "Los datos de la medición han sido actualizados exitosamente" 
          : "Se ha agregado una nueva medición exitosamente"
      });
    } catch (error) {
      console.error("Error al guardar medición:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la medición",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (medicion) => {
    setSelectedMedicion(medicion);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      // Intentar eliminar de Turso
      try {
        await client.execute({
          sql: "DELETE FROM mediciones WHERE id = ?",
          args: [id]
        });
        
        // Recargar mediciones desde Turso
        const result = await client.execute({
          sql: "SELECT * FROM mediciones WHERE indicador_id = ?",
          args: [indicadorId]
        });
        
        setMediciones(result.rows);
        
        // Actualizar localStorage como respaldo
        const saved = localStorage.getItem("mediciones");
        if (saved) {
          const allMediciones = JSON.parse(saved).filter(m => m.id !== id);
          localStorage.setItem("mediciones", JSON.stringify(allMediciones));
        }
      } catch (dbError) {
        console.error("Error al eliminar de Turso:", dbError);
        
        // Fallback a localStorage
        const saved = localStorage.getItem("mediciones");
        if (saved) {
          const allMediciones = JSON.parse(saved).filter(m => m.id !== id);
          localStorage.setItem("mediciones", JSON.stringify(allMediciones));
          
          // Actualizar el estado local
          setMediciones(mediciones.filter(m => m.id !== id));
        }
      }
      
      toast({
        title: "Medición eliminada",
        description: "La medición ha sido eliminada exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar medición:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la medición",
        variant: "destructive"
      });
    }
  };

  const filteredMediciones = mediciones.filter(medicion =>
    medicion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (medicion.comentarios && medicion.comentarios.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb y título */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Indicadores
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{indicadorTitulo}</h2>
          <p className="text-muted-foreground">
            Mediciones del indicador para el objetivo: {objetivoTitulo}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar mediciones..."
              className="pl-8 h-10 w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => {
            setSelectedMedicion(null);
            setIsModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Medición
          </Button>
        </div>
      </div>

      {/* Lista de Mediciones */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando mediciones...</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Título</th>
                  <th className="text-left p-4">Fecha</th>
                  <th className="text-left p-4">Medición</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Comentarios</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMediciones.map((medicion) => (
                  <motion.tr
                    key={medicion.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <LineChart className="h-5 w-5 text-primary" />
                        <span className="font-medium">{medicion.titulo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{medicion.fecha}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{medicion.medicion}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        medicion.estado === "Conforme" 
                          ? "bg-green-100 text-green-800"
                          : medicion.estado === "No conforme"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {medicion.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">{medicion.comentarios}</p>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(medicion)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(medicion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredMediciones.length === 0 && (
              <div className="text-center py-12">
                <LineChart className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay mediciones registradas para este indicador. Haz clic en "Nueva Medición" para comenzar.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <MedicionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMedicion(null);
        }}
        onSave={handleSave}
        medicion={selectedMedicion}
        indicadorId={indicadorId}
        indicadorTitulo={indicadorTitulo}
      />
    </div>
  );
}

export default MedicionesListing;
