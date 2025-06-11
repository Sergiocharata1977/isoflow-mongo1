import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

/**
 * Página mostrada cuando un usuario intenta acceder a una ruta para la que no tiene permisos
 */
export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
        
        <p className="text-gray-600 mb-6">
          No tienes permisos para acceder a esta sección del sistema. Si crees que esto es un error,
          por favor contacta al administrador.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button asChild className="w-full">
            <Link to="/">Volver al Inicio</Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link to="/login">Iniciar sesión con otra cuenta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
