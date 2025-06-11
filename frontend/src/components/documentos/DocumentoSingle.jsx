import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMongo } from "../../context/MongoContext";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft,
  FileText,
  Pencil,
  Trash2,
  Calendar,
  Tag,
  Clock,
  Eye,
  Download,
  BarChart,
  Link,
  AlertCircle,
  FileType
} from "lucide-react";

function DocumentoSingle({ documento, onBack, onEdit, onDelete }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { documentosService } = useMongo();
  
  // Consulta para obtener relaciones (si las hay)
  const { data: relacionesData, isLoading: loadingRelaciones } = useQuery({
    queryKey: ['documento_relaciones', documento.id],
    queryFn: async () => {
      // Esta función podría obtener relaciones de documentos con otros elementos
      // Por ahora retornamos un objeto vacío
      return {
        procesos: [],
        normas: [],
        auditorias: []
      };
    },
    enabled: !!documento.id,
    staleTime: 60000 // 1 minuto
  });

  // Función para obtener color según estado del documento
  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    
    switch (estado.toLowerCase()) {
      case 'vigente':
        return 'bg-green-100 text-green-800';
      case 'obsoleto':
        return 'bg-red-100 text-red-800';
      case 'borrador':
        return 'bg-yellow-100 text-yellow-800';
      case 'en revisión':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Documentos
        </button>
        <div className="flex space-x-2">
          {documento.url_documento && (
            <>
              <button
                onClick={() => setPreviewOpen(true)}
                className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Documento
              </button>
              <a
                href={documento.url_documento}
                download
                className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </a>
            </>
          )}
          <button
            onClick={() => onEdit(documento)}
            className="flex items-center px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </button>
          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
                onDelete(documento.id);
                onBack();
              }
            }}
            className="flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Header Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold">{documento.titulo}</h1>
                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(documento.estado)}`}>
                    {documento.estado}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <Tag className="h-4 w-4 mr-1" />
                    {documento.categoria_nombre || 'Sin categoría'}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <FileType className="h-4 w-4 mr-1" />
                    Versión {documento.version || '1.0'}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {documento.fecha_publicacion ? new Date(documento.fecha_publicacion).toLocaleDateString() : 'Sin fecha'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Descripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4">Descripción</h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              {documento.descripcion ? (
                <p className="whitespace-pre-line">{documento.descripcion}</p>
              ) : (
                <p className="text-gray-400 italic">Sin descripción</p>
              )}
            </div>
          </motion.div>

          {/* Vista previa del documento */}
          {documento.url_documento && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-4">Vista previa</h2>
              <div className="aspect-[16/9] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                {previewOpen ? (
                  <iframe 
                    src={documento.url_documento} 
                    className="w-full h-full rounded-lg" 
                    title={documento.titulo}
                  />
                ) : (
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <button
                      onClick={() => setPreviewOpen(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver documento
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar - 1 columna */}
        <div className="space-y-6">
          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <BarChart className="h-5 w-5 mr-2 text-blue-600" />
              Información adicional
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Fecha de publicación</p>
                <p className="font-medium">
                  {documento.fecha_publicacion 
                    ? new Date(documento.fecha_publicacion).toLocaleDateString() 
                    : 'No especificada'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(documento.estado)}`}>
                  {documento.estado || 'No especificado'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Versión</p>
                <p className="font-medium">{documento.version || '1.0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Categoría</p>
                <p className="font-medium">{documento.categoria_nombre || 'Sin categoría'}</p>
              </div>
              {documento.created_at && (
                <div>
                  <p className="text-sm text-gray-500">Fecha de creación</p>
                  <p className="font-medium">{new Date(documento.created_at).toLocaleDateString()}</p>
                </div>
              )}
              {documento.updated_at && (
                <div>
                  <p className="text-sm text-gray-500">Última actualización</p>
                  <p className="font-medium">{new Date(documento.updated_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Relaciones */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Link className="h-5 w-5 mr-2 text-blue-600" />
              Relaciones
            </h2>
            {loadingRelaciones ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Procesos relacionados */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Procesos relacionados</p>
                  {relacionesData?.procesos?.length > 0 ? (
                    <div className="space-y-2">
                      {relacionesData.procesos.map((proceso, index) => (
                        <div key={index} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          <span>{proceso.nombre}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No hay procesos relacionados</p>
                  )}
                </div>
                
                {/* Normas relacionadas */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Normas relacionadas</p>
                  {relacionesData?.normas?.length > 0 ? (
                    <div className="space-y-2">
                      {relacionesData.normas.map((norma, index) => (
                        <div key={index} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                          <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
                          <span>{norma.nombre}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No hay normas relacionadas</p>
                  )}
                </div>
                
                {/* Auditorías relacionadas */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Auditorías relacionadas</p>
                  {relacionesData?.auditorias?.length > 0 ? (
                    <div className="space-y-2">
                      {relacionesData.auditorias.map((auditoria, index) => (
                        <div key={index} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                          <div className="w-2 h-2 rounded-full bg-purple-600 mr-2"></div>
                          <span>{auditoria.nombre}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No hay auditorías relacionadas</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DocumentoSingle;
