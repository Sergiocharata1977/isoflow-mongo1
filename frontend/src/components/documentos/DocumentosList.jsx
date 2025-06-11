import { useState, useEffect, useCallback } from 'react';
import { useMongo } from '../../context/MongoContext';
import { Grid, List, Edit, Trash2, Plus, Search, FileText, AlertCircle, Download, Eye, Calendar, User, Tag, Upload, File } from 'lucide-react';
import Modal from '../common/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DocumentoSingle from './DocumentoSingle';

const DocumentosList = () => {
  const { documentosService, isLoading: contextLoading, error: contextError, dbConnected } = useMongo();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'card'
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  
  // Consulta para obtener documentos
  const { 
    data: documentos = [], 
    isLoading: loadingDocumentos,
    error: documentosError,
    refetch: refetchDocumentos
  } = useQuery({
    queryKey: ['documentos'],
    queryFn: async () => {
      if (!dbConnected) {
        console.log('Base de datos no conectada, esperando conexión...');
        return [];
      }
      console.log('Cargando documentos...');
      const result = await documentosService.getAllDocumentos();
      console.log('Documentos cargados:', result);
      return result || [];
    },
    enabled: dbConnected,
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: false
  });
  
  // Consulta para obtener procesos
  const { 
    data: procesos = [], 
    isLoading: loadingProcesos,
    error: procesosError
  } = useQuery({
    queryKey: ['procesos'],
    queryFn: async () => {
      if (!dbConnected) return [];
      console.log('Cargando procesos...');
      try {
        // Usando servicio MongoDB en lugar de Turso
        const result = await fetch('/api/procesos');
        const data = await result.json();
        console.log('Procesos cargados:', data);
        return data || [];
      } catch (error) {
        console.error('Error al cargar procesos:', error);
        return [];
      }
    },
    enabled: dbConnected,
    staleTime: 60000, // 1 minuto
    refetchOnWindowFocus: false
  });
  
  // Mutación para crear documento
  const createDocumentoMutation = useMutation({
    mutationFn: (newDocumento) => documentosService.createDocumento(newDocumento),
    onSuccess: () => {
      // Invalidar consultas y actualizar datos
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      // Resetear formulario y cerrar modal
      resetForm();
      setModalOpen(false);
    },
    onError: (error) => {
      console.error('Error al crear documento:', error);
      setLocalError('Error al guardar el documento. Por favor, intenta de nuevo.');
    }
  });
  
  // Mutación para actualizar documento
  const updateDocumentoMutation = useMutation({
    mutationFn: ({ id, data }) => documentosService.updateDocumento(id, data),
    onSuccess: () => {
      // Invalidar consultas y actualizar datos
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      // Resetear formulario y cerrar modal
      resetForm();
      setModalOpen(false);
    },
    onError: (error) => {
      console.error('Error al actualizar documento:', error);
      setLocalError('Error al actualizar el documento. Por favor, intenta de nuevo.');
    }
  });
  
  // Mutación para eliminar documento
  const deleteDocumentoMutation = useMutation({
    mutationFn: (id) => documentosService.deleteDocumento(id),
    onSuccess: () => {
      // Invalidar consultas y actualizar datos
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      // Si estamos viendo el documento que se eliminó, volver a la lista
      if (selectedDocumento && selectedDocumento.id === id) {
        setSelectedDocumento(null);
      }
    },
    onError: (error) => {
      console.error('Error al eliminar documento:', error);
      setLocalError('Error al eliminar el documento. Por favor, intenta de nuevo.');
    }
  });
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    descripcion: '',
    proceso_id: '',
    version: '',
    fecha_creacion: '',
    fecha_revision: '',
    autor: '',
    estado: 'Vigente',
    url_documento: '',
    tags: ''
  });
  
  // Estado para modo edición
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Para archivos PDF, podemos mostrar el nombre
      setFilePreview(file.name);
      
      // En un caso real, aquí subirías el archivo a un servidor y obtendrías una URL
      // Para este ejemplo, simularemos una URL local
      const fakeUrl = `documento_${Date.now()}.pdf`;
      
      setFormData({
        ...formData,
        url_documento: fakeUrl // En un caso real, esto sería la URL del servidor
      });
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        // Actualizar registro existente
        updateDocumentoMutation.mutate({
          id: currentId,
          data: {
            ...formData,
            updated_at: new Date().toISOString()
          }
        });
      } else {
        // Crear nuevo registro
        createDocumentoMutation.mutate({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error al guardar documento:', err);
      setLocalError('Error al guardar el documento. Por favor, intenta de nuevo.');
    }
  };
  
  // Función para editar un registro
  const handleEdit = (documento) => {
    setFormData({
      codigo: documento.codigo || '',
      titulo: documento.titulo || '',
      descripcion: documento.descripcion || '',
      proceso_id: documento.proceso_id ? documento.proceso_id.toString() : '',
      version: documento.version || '',
      fecha_creacion: documento.fecha_creacion || '',
      fecha_revision: documento.fecha_revision || '',
      autor: documento.autor || '',
      estado: documento.estado || 'Vigente',
      url_documento: documento.url_documento || '',
      tags: documento.tags || ''
    });
    
    // Si hay una URL de documento, mostrarla como vista previa
    if (documento.url_documento) {
      setFilePreview(documento.url_documento);
    } else {
      setFilePreview(null);
    }
    
    setSelectedFile(null);
    setEditMode(true);
    setCurrentId(documento.id);
    setModalOpen(true);
  };
  
  // Función para eliminar un registro
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      deleteDocumentoMutation.mutate(id);
    }
  };
  
  // Resetear formulario
  const resetForm = () => {
    setFormData({
      codigo: '',
      titulo: '',
      descripcion: '',
      proceso_id: '',
      version: '',
      fecha_creacion: '',
      fecha_revision: '',
      autor: '',
      estado: 'Vigente',
      url_documento: '',
      tags: ''
    });
    setFilePreview(null);
    setSelectedFile(null);
    setEditMode(false);
    setCurrentId(null);
  };

  // Abrir modal para nuevo registro
  const handleOpenNewModal = () => {
    resetForm();
    setEditMode(false);
    setModalOpen(true);
  };

  // Abrir modal de vista previa
  const handleOpenPreview = (url) => {
    setCurrentPreviewUrl(url);
    setPreviewModalOpen(true);
  };

  // Ver detalle de documento (vista Single)
  const handleViewDetail = (documento) => {
    setSelectedDocumento(documento);
  };
  
  // Volver a la lista desde la vista detallada
  const handleBackToList = () => {
    setSelectedDocumento(null);
  };

  // Filtrar documentos por término de búsqueda
  const filteredDocumentos = documentos.filter(documento => {
    const searchString = `${documento.codigo || ''} ${documento.titulo || ''} ${documento.proceso_nombre || ''} ${documento.autor || ''} ${documento.tags || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Obtener color según estado del documento
  const getStatusColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    
    switch (estado.toLowerCase()) {
      case 'vigente':
        return 'bg-green-100 text-green-800';
      case 'obsoleto':
        return 'bg-red-100 text-red-800';
      case 'en revisión':
        return 'bg-yellow-100 text-yellow-800';
      case 'borrador':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Verificar si hay algún error
  const error = contextError || documentosError || procesosError || localError;
  
  // Verificar si está cargando
  const isLoading = contextLoading || loadingDocumentos || loadingProcesos || 
                   createDocumentoMutation.isLoading || updateDocumentoMutation.isLoading || 
                   deleteDocumentoMutation.isLoading;

  // Mostrar mensaje de error si no hay conexión a la base de datos
  if (!dbConnected && !contextLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="mr-2" />
          <span>No se pudo conectar a la base de datos. Por favor, verifica tu conexión a internet y recarga la página.</span>
        </div>
      </div>
    );
  }
  
  // Si estamos viendo un documento en detalle
  if (selectedDocumento) {
    return (
      <DocumentoSingle 
        documento={selectedDocumento}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Documentos</h1>
        <div className="flex items-center space-x-4">
          {/* Botones de vista */}
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('card')} 
              className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-white shadow' : ''}`}
            >
              <Grid size={20} />
            </button>
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          {/* Botón para agregar */}
          <button
            onClick={handleOpenNewModal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            disabled={isLoading}
          >
            <Plus size={18} className="mr-2" />
            Nuevo Documento
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Modal para crear/editar documento */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editMode ? 'Editar Documento' : 'Nuevo Documento'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sección de archivo PDF */}
            <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
              <div className="text-center">
                {filePreview ? (
                  <div className="flex flex-col items-center">
                    <File size={48} className="text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-gray-900">{filePreview}</p>
                    <p className="text-xs text-gray-500 mt-1">Haz clic para cambiar el archivo</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload size={48} className="text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900">Haz clic para subir un documento PDF</p>
                    <p className="text-xs text-gray-500 mt-1">PDF (MAX. 10MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Código</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
                placeholder="Ej: DOC-001"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows="2"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Proceso</label>
              <select
                name="proceso_id"
                value={formData.proceso_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Seleccionar proceso</option>
                {procesos.map(proceso => (
                  <option key={proceso.id} value={proceso.id}>
                    {proceso.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Versión</label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
                placeholder="Ej: 1.0"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Fecha de Creación</label>
              <input
                type="date"
                name="fecha_creacion"
                value={formData.fecha_creacion}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Fecha de Revisión</label>
              <input
                type="date"
                name="fecha_revision"
                value={formData.fecha_revision}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Autor</label>
              <input
                type="text"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="Vigente">Vigente</option>
                <option value="Obsoleto">Obsoleto</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Borrador">Borrador</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">URL del Documento (opcional)</label>
              <input
                type="url"
                name="url_documento"
                value={formData.url_documento}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="https://ejemplo.com/documento.pdf"
              />
              <p className="text-xs text-gray-500 mt-1">Si subiste un archivo, esta URL se actualizará automáticamente</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Etiquetas (separadas por comas)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="calidad, procedimiento, instructivo"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : (editMode ? 'Actualizar' : 'Guardar')}
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Modal para vista previa de PDF */}
      <Modal 
        isOpen={previewModalOpen} 
        onClose={() => setPreviewModalOpen(false)} 
        title="Vista previa del documento"
        size="xl"
      >
        <div className="h-[70vh]">
          {currentPreviewUrl && (
            <iframe 
              src={currentPreviewUrl} 
              className="w-full h-full border-0" 
              title="Vista previa del documento"
            ></iframe>
          )}
        </div>
      </Modal>
      
      {/* Vista de lista */}
      {viewMode === 'list' && (
        <div className="bg-white shadow-md rounded overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proceso</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versión</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredDocumentos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center py-8">
                    No hay documentos disponibles
                  </td>
                </tr>
              ) : (
                filteredDocumentos.map((documento) => (
                  <tr 
                    key={documento.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetail(documento)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{documento.codigo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{documento.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{documento.proceso_nombre || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{documento.version}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{documento.autor}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(documento.estado)}`}>
                        {documento.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(documento);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(documento.id);
                        }}
                        className="text-red-600 hover:text-red-900 mr-2"
                      >
                        <Trash2 size={16} />
                      </button>
                      {documento.url_documento && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPreview(documento.url_documento);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Vista de tarjetas */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocumentos.map((documento) => (
            <div 
              key={documento.id} 
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewDetail(documento)}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs font-semibold text-gray-600 mr-2 mb-2">
                    {documento.codigo}
                  </span>
                  <h3 className="text-lg font-semibold truncate">{documento.titulo}</h3>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(documento);
                    }}
                    className="p-1 hover:bg-green-700 rounded"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(documento.id);
                    }}
                    className="p-1 hover:bg-green-700 rounded"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {documento.descripcion && (
                  <p className="text-sm mb-4">{documento.descripcion}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <FileText size={16} className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Proceso</p>
                      <p className="font-medium">{documento.proceso_nombre || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Autor</p>
                      <p className="font-medium">{documento.autor}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Creación</p>
                      <p className="font-medium">{documento.fecha_creacion}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(documento.estado)}`}>
                      {documento.estado}
                    </span>
                  </div>
                </div>
                
                {documento.tags && (
                  <div className="flex items-center mb-4">
                    <Tag size={16} className="text-gray-500 mr-2" />
                    <div className="flex flex-wrap gap-1">
                      {documento.tags.split(',').map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {documento.url_documento && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPreview(documento.url_documento);
                    }}
                    className="w-full mt-2 bg-blue-50 text-blue-600 px-4 py-2 rounded flex items-center justify-center"
                  >
                    <Eye size={16} className="mr-2" />
                    Ver documento
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentosList;
