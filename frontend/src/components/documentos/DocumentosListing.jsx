
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
  FileText,
  ChevronRight
} from "lucide-react";
import DocumentoModal from "./DocumentoModal";
import DocumentoSingle from "./DocumentoSingle";

// Cliente de Turso
const client = createClient({
  url: "libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ"
});

function DocumentosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentDocumento, setCurrentDocumento] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocumentos();
  }, []);

  const loadDocumentos = async () => {
    try {
      setIsLoading(true);
      
      // Intentar cargar desde Turso
      try {
        const result = await client.execute({
          sql: "SELECT * FROM documentos"
        });
        
        if (result.rows.length > 0) {
          setDocumentos(result.rows);
          setIsLoading(false);
          return;
        }
      } catch (dbError) {
        console.error("Error al cargar desde Turso:", dbError);
      }
      
      // Si no se pudo cargar desde Turso, intentar desde localStorage
      const saved = localStorage.getItem("documentos");
      let data = saved ? JSON.parse(saved) : [];
      
      // Si hay datos en localStorage, intentar sincronizarlos con Turso
      if (data.length > 0) {
        try {
          for (const doc of data) {
            await client.execute({
              sql: `INSERT OR REPLACE INTO documentos 
                    (id, titulo, procesos, version, descripcion, fecha_creacion, fecha_revision, autor, estado, archivo_url) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                doc.id, 
                doc.titulo, 
                doc.procesos || '', 
                doc.version || '', 
                doc.descripcion || '', 
                doc.fechaCreacion || new Date().toISOString(), 
                doc.fechaRevision || '', 
                doc.autor || '', 
                doc.estado || 'Activo', 
                doc.archivoUrl || ''
              ]
            });
          }
          
          // Cargar los datos sincronizados desde Turso
          const syncResult = await client.execute({
            sql: "SELECT * FROM documentos"
          });
          
          if (syncResult.rows.length > 0) {
            setDocumentos(syncResult.rows);
          } else {
            setDocumentos(data);
          }
        } catch (syncError) {
          console.error("Error al sincronizar con Turso:", syncError);
          setDocumentos(data);
        }
      } else {
        setDocumentos([]);
      }
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (documentoData) => {
    try {
      let updatedDocumentos;
      const newId = selectedDocumento ? selectedDocumento.id : Date.now();
      const newDoc = { 
        ...documentoData, 
        id: newId,
        fechaCreacion: selectedDocumento ? selectedDocumento.fechaCreacion : new Date().toISOString()
      };
      
      // Intentar guardar en Turso
      try {
        await client.execute({
          sql: `INSERT OR REPLACE INTO documentos 
                (id, titulo, procesos, version, descripcion, fecha_creacion, fecha_revision, autor, estado, archivo_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            newDoc.id, 
            newDoc.titulo, 
            newDoc.procesos || '', 
            newDoc.version || '', 
            newDoc.descripcion || '', 
            newDoc.fechaCreacion, 
            newDoc.fechaRevision || '', 
            newDoc.autor || '', 
            newDoc.estado || 'Activo', 
            newDoc.archivoUrl || ''
          ]
        });
        
        // Recargar documentos desde Turso
        const result = await client.execute({
          sql: "SELECT * FROM documentos"
        });
        
        if (result.rows.length > 0) {
          updatedDocumentos = result.rows;
          // Actualizar también localStorage como respaldo
          localStorage.setItem("documentos", JSON.stringify(updatedDocumentos));
        }
      } catch (dbError) {
        console.error("Error al guardar en Turso:", dbError);
        
        // Fallback a localStorage
        if (selectedDocumento) {
          updatedDocumentos = documentos.map(d => 
            d.id === selectedDocumento.id ? newDoc : d
          );
        } else {
          updatedDocumentos = [...documentos, newDoc];
        }
        localStorage.setItem("documentos", JSON.stringify(updatedDocumentos));
      }
      
      setDocumentos(updatedDocumentos);
      setIsModalOpen(false);
      setSelectedDocumento(null);
      
      toast({
        title: selectedDocumento ? "Documento actualizado" : "Documento creado",
        description: selectedDocumento 
          ? "Los datos del documento han sido actualizados exitosamente" 
          : "Se ha agregado un nuevo documento exitosamente"
      });
    } catch (error) {
      console.error("Error al guardar documento:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el documento",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (documento) => {
    setSelectedDocumento(documento);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      // Intentar eliminar de Turso
      try {
        await client.execute({
          sql: "DELETE FROM documentos WHERE id = ?",
          args: [id]
        });
        
        // Recargar documentos desde Turso
        const result = await client.execute({
          sql: "SELECT * FROM documentos"
        });
        
        setDocumentos(result.rows);
        // Actualizar también localStorage como respaldo
        localStorage.setItem("documentos", JSON.stringify(result.rows));
      } catch (dbError) {
        console.error("Error al eliminar de Turso:", dbError);
        
        // Fallback a localStorage
        const updatedDocumentos = documentos.filter(d => d.id !== id);
        setDocumentos(updatedDocumentos);
        localStorage.setItem("documentos", JSON.stringify(updatedDocumentos));
      }
      
      toast({
        title: "Documento eliminado",
        description: "El documento ha sido eliminado exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el documento",
        variant: "destructive"
      });
    }
  };

  const handleViewDocumento = (documento) => {
    setCurrentDocumento(documento);
    setShowSingle(true);
  };

  const filteredDocumentos = documentos.filter(documento =>
    documento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (documento.procesos && documento.procesos.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (showSingle) {
    return (
      <DocumentoSingle
        documento={currentDocumento}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar documentos..."
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
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Documento
          </Button>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando documentos...</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Título</th>
                  <th className="text-left p-4">Procesos</th>
                  <th className="text-left p-4">Versión</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocumentos.map((documento) => (
                  <motion.tr
                    key={documento.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border cursor-pointer hover:bg-accent/50"
                    onClick={() => handleViewDocumento(documento)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{documento.titulo}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{documento.procesos}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-primary/10 rounded-full text-xs text-primary">
                        v{documento.version}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(documento);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(documento.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredDocumentos.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay documentos registrados. Haz clic en "Nuevo Documento" para comenzar.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <DocumentoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDocumento(null);
        }}
        onSave={handleSave}
        documento={selectedDocumento}
      />
    </div>
  );
}

export default DocumentosListing;
