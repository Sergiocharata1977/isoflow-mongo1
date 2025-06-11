import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Importación lazy de componentes para mejorar el rendimiento
const LoginPage = lazy(() => import('@/pages/auth/login'));
const MenuPrincipal = lazy(() => import('@/components/menu/MenuPrincipal'));
const Unauthorized = lazy(() => import('@/pages/Unauthorized'));
const CalendarioEventos = lazy(() => import('@/components/calendario/CalendarioEventos'));
const ObjetivosCalidadPage = lazy(() => import('@/pages/ObjetivosCalidadPage'));

// Componente de carga para las importaciones lazy
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
  </div>
);

export default function AppRoutes() {
  const { isAuthenticated, login, logout } = useAuth();

  // Manejador de inicio de sesión
  const handleLogin = (userData) => {
    login(userData);
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Ruta pública - Inicio de sesión */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated 
              ? <LoginPage onLogin={handleLogin} /> 
              : <Navigate to="/" replace />
          } 
        />

        {/* Ruta de acceso no autorizado */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Ruta para el Asistente ISO eliminada */}

        {/* Ruta para Objetivos de Calidad */}
        <Route
          path="/objetivos-calidad"
          element={
            <ProtectedRoute>
              <ObjetivosCalidadPage />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <MenuPrincipal onLogout={logout} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
}
