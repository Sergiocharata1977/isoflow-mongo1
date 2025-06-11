import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from '@libsql/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import NoticiaModal from "./NoticiaModal";
import NoticiaSingle from "./NoticiaSingle";
import { useTheme } from "@/context/ThemeContext";

function NoticiasListing() {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [noticias, setNoticias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [viewSingle, setViewSingle] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noticiaToDelete, setNoticiaToDelete] = useState(null);

  // Cliente Turso
  const client = createClient({
    url: "libsql://iso103-1-sergiocharata1977.aws-us-east-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDUzMjMwMjIsImlkIjoiNmY3ZjA4ZmEtNTQ0My00ZjQ2LWI4MTMtYmZjY2JhYWJiOTc3IiwicmlkIjoiYzRhNDEzYWItZDdmNi00Y2I4LWEzZjktYjA2MDBmYzM0MjM3In0.gZSBIQ1Xki6KJmWrY_21DLN5mnc7S5dPdSf-NN3vl9MH9M43VOLF1VGKiqQPHeBmwAC6_28cFr1tST5gUlODCQ"
  });

  // Datos de ejemplo para mostrar si no hay datos en la base de datos
  const noticiasEjemplo = [
    {
      id: 1,
      titulo: "Lanzamiento de la Plataforma Digital de Señores del Agro",
      contenido: "La Dirección de Señores del Agro cuenta desde hoy con la digitalización total con el lanzamiento de su nueva plataforma interna para la gestión de operaciones agropecuarias. La plataforma permitirá a los colaboradores y productores gestionar sus actividades de manera más eficiente.",
      fecha: "2025-04-07",
      imagen: "https://storage.googleapis.com/hostinger-horizons-assets-prod/8dbf3f66-6a64-4665-ae25-f32f332f4fba/cbb9bfb3667307875da0e1063c6257f0.png"
    },
    {
      id: 2,
      titulo: "Capacitaciones sobre Buenas Prácticas Agrícolas",
      contenido: "El Departamento de Innovación y Desarrollo de Señores del Agro ha organizado una serie de capacitaciones sobre Buenas Prácticas Agrícolas para nuestros colaboradores. Las jornadas se llevarán a cabo del 12 al 15 de Mayo y esperan excelentes resultados.",
      fecha: "2025-04-06",
      imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
    },
    {
      id: 3,
      titulo: "Primera Reunión de Trabajo para la Implementación de ISO 9001",
      contenido: "El pasado miércoles 25 de marzo, el equipo de Señores del Agro participó en la primera reunión oficial para la implementación del Sistema de Gestión de Calidad bajo la norma ISO 9001:2015. Durante el encuentro se definieron los próximos pasos.",
      fecha: "2025-04-05",
      imagen: "https://images.unsplash.com/photo-1552581234-26160f608093"
    },
    {
      id: 4,
      titulo: "La ISO 9001: Un Cultivo de Calidad en el Agro",
      contenido: "La implementación de la norma ISO 9001 en las empresas agropecuarias ha dejado claro que una buena base contribuye en una excelente temporada. Cada paso que da Señores del Agro nos encamina hacia la excelencia.",
      fecha: "2025-04-04",
      imagen: "https://images.unsplash.com/photo-1560493676-04071c5f467b"
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Intentar cargar desde Turso primero
      try {
        const result = await client.execute('SELECT * FROM noticias ORDER BY fecha DESC');
        if (result.rows.length > 0) {
          setNoticias(result.rows);
          setIsLoading(false);
          return;
        }
      } catch (dbError) {
        console.log("Fallback a localStorage:", dbError);
      }

      // Fallback a localStorage
      const saved = localStorage.getItem("noticias");
      if (saved) {
        setNoticias(JSON.parse(saved));
      } else {
        // Si no hay datos en localStorage, usar los datos de ejemplo
        setNoticias(noticiasEjemplo);
        localStorage.setItem("noticias", JSON.stringify(noticiasEjemplo));
        
        // Intentar guardar los datos de ejemplo en Turso
        try {
          for (const noticia of noticiasEjemplo) {
            await saveNoticiaToTurso(noticia);
          }
        } catch (error) {
          console.error("Error al guardar noticias de ejemplo en Turso:", error);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las noticias",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNoticiaToTurso = async (noticia) => {
    try {
      // Verificar si la noticia ya existe
      const checkResult = await client.execute({
        sql: 'SELECT id FROM noticias WHERE id = ?',
        args: [noticia.id]
      });

      if (checkResult.rows.length > 0) {
        // Actualizar
        await client.execute({
          sql: `UPDATE noticias SET 
                titulo = ?, 
                contenido = ?, 
                fecha = ?, 
                imagen = ? 
                WHERE id = ?`,
          args: [
            noticia.titulo,
            noticia.contenido,
            noticia.fecha,
            noticia.imagen,
            noticia.id
          ]
        });
      } else {
        // Insertar
        await client.execute({
          sql: `INSERT INTO noticias (id, titulo, contenido, fecha, imagen) 
                VALUES (?, ?, ?, ?, ?)`,
          args: [
            noticia.id,
            noticia.titulo,
            noticia.contenido,
            noticia.fecha,
            noticia.imagen
          ]
        });
      }
      return true;
    } catch (error) {
      console.error("Error saving to Turso:", error);
      return false;
    }
  };

  const handleSave = async (noticiaData) => {
    setIsLoading(true);
    try {
      let updatedNoticias;
      let savedNoticia;

      if (selectedNoticia) {
        savedNoticia = { 
          ...noticiaData, 
          id: selectedNoticia.id 
        };
        
        updatedNoticias = noticias.map(n => 
          n.id === selectedNoticia.id ? savedNoticia : n
        );
        
        toast({
          title: "Noticia actualizada",
          description: "La noticia ha sido actualizada exitosamente"
        });
      } else {
        savedNoticia = { 
          ...noticiaData, 
          id: Date.now() 
        };
        
        updatedNoticias = [savedNoticia, ...noticias];
        
        toast({
          title: "Noticia creada",
          description: "Se ha agregado una nueva noticia exitosamente"
        });
      }

      // Guardar en Turso
      const tursoSaved = await saveNoticiaToTurso(savedNoticia);
      if (!tursoSaved) {
        // Fallback a localStorage si falla Turso
        localStorage.setItem("noticias", JSON.stringify(updatedNoticias));
      }

      setNoticias(updatedNoticias);
      setIsModalOpen(false);
      setSelectedNoticia(null);
    } catch (error) {
      console.error("Error saving noticia:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la noticia",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (noticia) => {
    setSelectedNoticia(noticia);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setNoticiaToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      // Intentar eliminar de Turso primero
      try {
        await client.execute({
          sql: 'DELETE FROM noticias WHERE id = ?',
          args: [id]
        });
      } catch (dbError) {
        console.log("Fallback a localStorage para eliminar:", dbError);
      }

      // Actualizar estado local
      const updatedNoticias = noticias.filter(n => n.id !== id);
      setNoticias(updatedNoticias);
      localStorage.setItem("noticias", JSON.stringify(updatedNoticias));
      
      // Si estamos viendo el detalle de la noticia que se eliminó, volver a la lista
      if (viewSingle && selectedNoticia && selectedNoticia.id === id) {
        setViewSingle(false);
        setSelectedNoticia(null);
      }
      
      toast({
        title: "Noticia eliminada",
        description: "La noticia ha sido eliminada exitosamente"
      });
      
      setIsDeleteDialogOpen(false);
      setNoticiaToDelete(null);
    } catch (error) {
      console.error("Error deleting noticia:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la noticia",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewDetail = (noticia) => {
    setSelectedNoticia(noticia);
    setViewSingle(true);
  };
  
  const handleBackToList = () => {
    setViewSingle(false);
    setSelectedNoticia(null);
  };

  // Si estamos viendo el detalle de una noticia
  if (viewSingle && selectedNoticia) {
    return (
      <NoticiaSingle 
        noticia={selectedNoticia} 
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={confirmDelete}
      />
    );
  }

  return (
    <div className={`container mx-auto px-6 py-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Noticias internas</h1>
          <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Mantente al día con las últimas novedades de Los Señores del Agro
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex justify-end">
          <Button 
            onClick={() => {
              setSelectedNoticia(null);
              setIsModalOpen(true);
            }}
            className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Noticia
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-white' : 'border-primary'}`}></div>
        </div>
      ) : (
        <>
          {noticias.length === 0 ? (
            <div className={`flex justify-center items-center min-h-[300px] rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="text-center max-w-md p-8">
                <Bell className={`mx-auto h-16 w-16 mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No hay noticias disponibles</h3>
                <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Haga clic en "Nueva Noticia" para comenzar.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {noticias.map((noticia, index) => (
                <motion.div
                  key={noticia.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg overflow-hidden transition-colors ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-primary'}`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Bell className="h-4 w-4" />
                          <span>{new Date(noticia.fecha).toLocaleDateString()}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(noticia);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`${isDark ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' : 'text-red-500 hover:text-red-700'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(noticia.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{noticia.titulo}</h2>
                      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{noticia.contenido}</p>
                      <Button 
                        variant="ghost" 
                        className={`group ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}`}
                        onClick={() => handleViewDetail(noticia)}
                      >
                        Leer más
                        <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                    {noticia.imagen && (
                      <div className="md:w-1/3">
                        <img
                          src={noticia.imagen}
                          alt={noticia.titulo}
                          className="w-full h-full object-cover aspect-video md:aspect-auto"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal para crear/editar noticias */}
      {isModalOpen && (
        <NoticiaModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNoticia(null);
          }}
          onSave={handleSave}
          noticia={selectedNoticia}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      {isDeleteDialogOpen && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className={`max-w-md ${isDark ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
            <DialogHeader>
              <DialogTitle className={isDark ? 'text-white' : ''}>Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <p className={`py-4 ${isDark ? 'text-gray-300' : ''}`}>¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.</p>
            <DialogFooter>
              <Button 
                variant="outline" 
                className={isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(noticiaToDelete)}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default NoticiasListing;
