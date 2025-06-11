import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Componente que protege rutas para usuarios autenticados
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si el usuario está autenticado
 * @param {string[]} [props.allowedRoles] - Roles permitidos para acceder a la ruta (opcional)
 * @returns {React.ReactNode} - Componente hijo o redirección a login
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // Si el usuario no está autenticado, redirigir al login
  if (!isAuthenticated) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especificaron roles permitidos, verificar que el usuario tenga uno de esos roles
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // El usuario no tiene los permisos necesarios, redirigir a una página de acceso denegado
    return <Navigate to="/unauthorized" replace />;
  }

  // Usuario autenticado y con los permisos necesarios
  return children;
}
