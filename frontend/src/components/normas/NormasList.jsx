import { useState, useEffect, useCallback } from 'react';
import { useMongo } from '../../context/MongoContext';
import { Grid, List, Edit, Trash2, Plus, Search, FileText, AlertCircle, Check, X } from 'lucide-react';
import Modal from '../common/Modal';

const NormasList = () => {
  const { handleRequest, isLoading, error, dbConnected } = useMongo();
  const [normas, setNormas] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'card'
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [localError, setLocalError] = useState(null);
  
  // Cargar datos usando useCallback para evitar recreaciones innecesarias
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    setLocalError(null);
    
    try {
      console.log('Cargando datos de normas-puntos...');
      // Importar el servicio de normas
      const { default: normasService } = await import('../../services/normas');
      
      // Llamar a la API de MongoDB para obtener los puntos de norma
      const response = await fetch('http://localhost:3002/api/normas-puntos');
      const data = await response.json();
      
      console.log('Datos de normas-puntos cargados:', data);
      setNormas(data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setLocalError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoadingData(false);
    }
  }, [dbConnected]);
  
  // Cargar datos al montar el componente y cuando cambie la conexión a la base de datos
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    descripcion: '',
    version: '',
    fecha_vigencia: '',
    estado: 'Vigente',
    responsable: '',
    observaciones: ''
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
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Importar el servicio de normas
      const { default: normasService } = await import('../../services/normas');
      
      const normaPunto = {
        norma: formData.codigo,
        clausula: formData.version || '1.0',
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipo: 'Requisito',
        palabrasClave: formData.responsable ? [formData.responsable] : []
      };
      
      if (editMode && currentId) {
        // Actualizar registro existente
        await fetch(`http://localhost:3002/api/normas-puntos/${currentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(normaPunto)
        });
      } else {
        // Crear nuevo registro
        await fetch('http://localhost:3002/api/normas-puntos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(normaPunto)
        });
      }
      
      // Recargar datos
      await fetchData();
      
      // Resetear formulario y cerrar modal
      resetForm();
      setModalOpen(false);
    } catch (err) {
      console.error('Error al guardar datos:', err);
      setLocalError('Error al guardar los datos. Por favor, intenta de nuevo.');
    }
  };
  
  // Función para editar un registro
  const handleEdit = (norma) => {
    setEditMode(true);
    setCurrentId(norma._id);
    setFormData({
      codigo: norma.norma,
      titulo: norma.titulo,
      descripcion: norma.descripcion,
      version: norma.clausula,
      fecha_vigencia: norma.createdAt ? new Date(norma.createdAt).toISOString().split('T')[0] : '',
      estado: 'Vigente',
      responsable: norma.palabrasClave && norma.palabrasClave.length > 0 ? norma.palabrasClave[0] : '',
      observaciones: ''
    });
    setModalOpen(true);
  };
  
  // Función para eliminar un registro
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este punto de norma?')) {
      try {
        // Llamar a la API de MongoDB para eliminar
        await fetch(`http://localhost:3002/api/normas-puntos/${id}`, {
          method: 'DELETE'
        });
        
        // Recargar datos
        await fetchData();
        
        // Mostrar mensaje de éxito
        alert('Punto de norma eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar punto de norma:', error);
      }
    }
  };
  
  // Resetear formulario
  const resetForm = () => {
    setFormData({
      codigo: '',
      titulo: '',
      descripcion: '',
      version: '',
      fecha_vigencia: '',
      estado: 'Vigente',
      responsable: '',
      observaciones: ''
    });
    setEditMode(false);
    setCurrentId(null);
  };

  // Abrir modal para nuevo registro
  const handleOpenNewModal = () => {
    resetForm();
    setEditMode(false);
    setModalOpen(true);
  };

  // Filtrar normas según término de búsqueda
  const filteredNormas = normas.filter(norma => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (norma.norma && norma.norma.toLowerCase().includes(searchLower)) ||
      (norma.titulo && norma.titulo.toLowerCase().includes(searchLower)) ||
      (norma.descripcion && norma.descripcion.toLowerCase().includes(searchLower)) ||
      (norma.palabrasClave && norma.palabrasClave.join(' ').toLowerCase().includes(searchLower))
    );
  });

  // Obtener color según estado de la norma
  const getStatusColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    
    switch (estado.toLowerCase()) {
      case 'vigente':
        return 'bg-green-100 text-green-800';
      case 'obsoleta':
        return 'bg-red-100 text-red-800';
      case 'en revisión':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mostrar mensaje de error si no hay conexión a la base de datos
  if (!dbConnected && !isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="mr-2" />
          <span>No se pudo conectar a la base de datos. Por favor, verifica tu conexión a internet y recarga la página.</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Puntos de Norma</h1>
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
              placeholder="Buscar puntos de norma..."
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
            disabled={isLoading || loadingData}
          >
            <Plus size={18} className="mr-2" />
            Nuevo Punto de Norma
          </button>
        </div>
      </div>
      
      {(error || localError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="mr-2" />
          <span>{localError || error}</span>
        </div>
      )}
      
      {/* Modal para crear/editar punto de norma */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editMode ? 'Editar Punto de Norma' : 'Nuevo Punto de Norma'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Código</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
                placeholder="Ej: 4.1.1"
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
                rows="3"
                required
              ></textarea>
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
                placeholder="Ej: 2023"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Fecha de Vigencia</label>
              <input
                type="date"
                name="fecha_vigencia"
                value={formData.fecha_vigencia}
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
                <option value="Obsoleta">Obsoleta</option>
                <option value="En Revisión">En Revisión</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Responsable</label>
              <input
                type="text"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows="2"
              ></textarea>
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
      
      {/* Vista de lista */}
      {viewMode === 'list' && (
        <div className="bg-white shadow-md rounded overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 bg-green-600 text-white text-left">Norma</th>
                <th className="px-4 py-2 bg-green-600 text-white text-left">Título</th>
                <th className="px-4 py-2 bg-green-600 text-white text-left">Cláusula</th>
                <th className="px-4 py-2 bg-green-600 text-white text-left">Palabras Clave</th>
                <th className="px-4 py-2 bg-green-600 text-white text-left">Fecha de Creación</th>
                <th className="px-4 py-2 bg-green-600 text-white text-left">Estado</th>
                <th className="px-4 py-2 bg-green-600 text-white text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || loadingData ? (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center">
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredNormas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center py-8">
                    No hay puntos de norma disponibles
                  </td>
                </tr>
              ) : (
                filteredNormas.map(norma => (
                  <tr key={norma._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{norma.norma}</td>
                    <td className="px-4 py-2 border-b">{norma.titulo}</td>
                    <td className="px-4 py-2 border-b">{norma.clausula}</td>
                    <td className="px-4 py-2 border-b">{norma.palabrasClave?.join(', ') || '-'}</td>
                    <td className="px-4 py-2 border-b">{norma.createdAt ? new Date(norma.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2 border-b">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor('Vigente')}`}>
                        Vigente
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(norma)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(norma._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading || loadingData ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : filteredNormas.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No hay puntos de norma disponibles
            </div>
          ) : (
            filteredNormas.map(norma => (
              <div key={norma._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-600 text-white p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="bg-white text-green-600 px-2 py-1 rounded text-xs font-bold mr-2">
                          {norma.norma}
                        </span>
                        <h3 className="text-lg font-semibold">{norma.titulo}</h3>
                      </div>
                      <p className="text-sm opacity-90 mt-1">Cláusula: {norma.clausula}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(norma)}
                        className="p-1 hover:bg-green-700 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(norma._id)}
                        className="p-1 hover:bg-green-700 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm mb-4">{norma.descripcion}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Palabras Clave</p>
                      <p className="font-medium">{norma.palabrasClave?.join(', ') || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor('Vigente')}`}>
                        Vigente
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha Creación</p>
                      <p className="font-medium">{norma.createdAt ? new Date(norma.createdAt).toLocaleDateString() : '-'}</p>
                    </div>
                  </div>
                  
                  {norma.tipo && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="text-sm">{norma.tipo}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NormasList;
