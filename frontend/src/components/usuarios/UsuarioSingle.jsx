import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Shield, Mail, Calendar, User, Key, CheckCircle } from 'lucide-react';
import { useMongo } from '../../context/MongoContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const UsuarioSingle = ({ usuario, onBack, onEdit, onDelete }) => {
  const { isLoading: contextLoading, error: contextError, dbConnected } = useMongo();
  const queryClient = useQueryClient();

  // Mapeo de secciones para mostrar nombres legibles
  const sectionNames = {
    tablero: "Tablero Central",
    clientes: "Clientes",
    personal: "Personal",
    puestos: "Puestos",
    departamentos: "Departamentos",
    procesos: "Procesos",
    objetivos: "Objetivos",
    indicadores: "Indicadores",
    mediciones: "Mediciones",
    documentos: "Documentos",
    norma: "Puntos de la Norma",
    usuarios: "Usuarios",
    configuracion: "Configuración"
  };

  // Consulta para obtener actividades recientes (simulado)
  const { data: actividades = [] } = useQuery({
    queryKey: ['actividades', usuario.id],
    queryFn: async () => {
      // Simulación de actividades recientes
      return [
        { id: 1, tipo: 'login', fecha: '2025-04-20 09:15', descripcion: 'Inicio de sesión' },
        { id: 2, tipo: 'documento', fecha: '2025-04-19 14:30', descripcion: 'Creó documento ISO-P-001' },
        { id: 3, tipo: 'personal', fecha: '2025-04-18 11:45', descripcion: 'Actualizó datos de personal' }
      ];
    },
    enabled: !!usuario.id,
    staleTime: 60000
  });

  // Función para obtener el color del rol
  const getRolColor = (rol) => {
    switch (rol) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabecera con botón de volver */}
      <div className="p-4 border-b flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Volver a la lista
        </button>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(usuario)}
            className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            title="Editar usuario"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(usuario.id)}
            className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
            title="Eliminar usuario"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col md:flex-row">
        {/* Columna principal (2/3) */}
        <div className="md:w-2/3 p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
              <User size={32} />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{usuario.nombre}</h1>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRolColor(usuario.rol)}`}>
                  <Shield className="w-3 h-3 inline mr-1" />
                  {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-gray-900">{usuario.email}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fecha de creación</h3>
                <p className="text-gray-900">
                  {new Date(usuario.id).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actividades recientes */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Actividades recientes</h2>
            {actividades.length > 0 ? (
              <div className="space-y-4">
                {actividades.map(actividad => (
                  <div key={actividad.id} className="flex items-start p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mr-3">
                      {actividad.tipo === 'login' && <Key size={16} />}
                      {actividad.tipo === 'documento' && <Edit size={16} />}
                      {actividad.tipo === 'personal' && <User size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{actividad.descripcion}</p>
                      <p className="text-xs text-gray-500">{actividad.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay actividades recientes</p>
            )}
          </div>
        </div>

        {/* Columna lateral (1/3) */}
        <div className="md:w-1/3 bg-gray-50 p-6 border-l">
          <h2 className="text-lg font-semibold mb-4">Permisos de acceso</h2>
          <div className="space-y-2">
            {usuario.permisos && usuario.permisos.length > 0 ? (
              usuario.permisos.map((permiso, index) => (
                <div key={index} className="flex items-center p-2 bg-white rounded border">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>{sectionNames[permiso] || permiso}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No tiene permisos asignados</p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Información de seguridad</h2>
            <div className="space-y-4">
              <div className="p-3 bg-white rounded border">
                <h3 className="text-sm font-medium">Último inicio de sesión</h3>
                <p className="text-gray-600 text-sm">2025-04-22 09:15</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <h3 className="text-sm font-medium">Dirección IP</h3>
                <p className="text-gray-600 text-sm">192.168.1.100</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <h3 className="text-sm font-medium">Dispositivo</h3>
                <p className="text-gray-600 text-sm">Chrome en Windows</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioSingle;
