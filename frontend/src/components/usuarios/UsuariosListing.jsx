import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  Users,
  Shield,
  Grid,
  List as ListIcon
} from "lucide-react";
import UsuarioModal from "./UsuarioModal";
import UsuarioSingle from "./UsuarioSingle";
import { usuariosService } from "../../services/usuarios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";

function UsuariosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'card'
  const [viewSingle, setViewSingle] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await usuariosService.getAll();
      
      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setUsuarios(data);
      } else {
        // Si no hay usuarios, crear algunos de muestra
        const sampleUsuarios = [
          {
            nombre: "Administrador",
            email: "admin@sgc.com",
            password: "admin123",
            rol: "admin",
            permisos: ["tablero", "personal", "documentos", "procesos", "usuarios", "configuracion"]
          },
          {
            nombre: "Juan Pérez",
            email: "juan@sgc.com",
            password: "juan123",
            rol: "supervisor",
            permisos: ["tablero", "personal", "documentos", "procesos"]
          },
          {
            nombre: "María López",
            email: "maria@sgc.com",
            password: "maria123",
            rol: "usuario",
            permisos: ["tablero", "documentos"]
          }
        ];
        
        // Crear usuarios de muestra en MongoDB
        for (const usuario of sampleUsuarios) {
          await usuariosService.create(usuario);
        }
        
        // Recargar los datos
        const { data: newData } = await usuariosService.getAll();
        setUsuarios(newData || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (usuarioData) => {
    setIsLoading(true);
    try {
      let result;
      
      if (selectedUsuario) {
        result = await usuariosService.update(selectedUsuario.id, usuarioData);
        toast({
          title: "Usuario actualizado",
          description: "Los datos del usuario han sido actualizados exitosamente"
        });
      } else {
        result = await usuariosService.create(usuarioData);
        toast({
          title: "Usuario creado",
          description: "Se ha agregado un nuevo usuario exitosamente"
        });
      }

      if (result.error) {
        throw result.error;
      }

      // Recargar los datos
      await loadData();
      setIsModalOpen(false);
      setSelectedUsuario(null);
    } catch (error) {
      console.error("Error saving usuario:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el usuario",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setUsuarioToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const { error } = await usuariosService.delete(id);
      
      if (error) {
        throw error;
      }

      // Recargar los datos
      await loadData();
      
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente"
      });
    } catch (error) {
      console.error("Error deleting usuario:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setUsuarioToDelete(null);
    }
  };
  
  const handleViewDetail = (usuario) => {
    setSelectedUsuario(usuario);
    setViewSingle(true);
  };
  
  const handleBackToList = () => {
    setViewSingle(false);
    setSelectedUsuario(null);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Si estamos viendo el detalle de un usuario
  if (viewSingle && selectedUsuario) {
    return (
      <UsuarioSingle 
        usuario={selectedUsuario} 
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={confirmDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-muted' : ''}
          >
            <ListIcon className="h-4 w-4 mr-2" />
            Lista
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('card')}
            className={viewMode === 'card' ? 'bg-muted' : ''}
          >
            <Grid className="h-4 w-4 mr-2" />
            Tarjetas
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Vista de Lista */}
          {viewMode === 'list' && (
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Nombre</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Rol</th>
                    <th className="text-right p-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((usuario) => (
                    <motion.tr
                      key={usuario.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleViewDetail(usuario)}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{usuario.nombre}</span>
                        </div>
                      </td>
                      <td className="p-4">{usuario.email}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(usuario);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(usuario.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredUsuarios.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    No hay usuarios registrados. Haz clic en "Nuevo Usuario" para comenzar.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vista de Tarjetas */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsuarios.map((usuario) => (
                <motion.div
                  key={usuario.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewDetail(usuario)}
                >
                  <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{usuario.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {usuario.rol}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-2">Permisos</h4>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(usuario.permisos) ? usuario.permisos.map((permiso, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary-foreground"
                        >
                          {permiso}
                        </span>
                      )) : (
                        <span className="text-sm text-muted-foreground">Sin permisos asignados</span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border-t flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(usuario);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(usuario.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </motion.div>
              ))}
              
              {filteredUsuarios.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white border rounded-lg">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    No hay usuarios registrados. Haz clic en "Nuevo Usuario" para comenzar.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUsuario(null);
        }}
        onSave={handleSave}
        usuario={selectedUsuario}
      />

      {/* Diálogo de confirmación para eliminar */}
      {isDeleteDialogOpen && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <p className="py-4">¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(usuarioToDelete)}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default UsuariosListing;
