import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService.js';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efecto para verificar si hay un usuario en localStorage al cargar la aplicación
  useEffect(() => {
    const checkUserAuth = async () => {
      console.log('Verificando autenticación...');
      try {
        const user = authService.getCurrentUser();
        console.log('Usuario recuperado:', user);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
      } finally {
        console.log('Finalizando verificación, loading:', loading);
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (user) => {
    console.log('Login iniciado con usuario:', user);
    setCurrentUser(user);
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('Usuario guardado en localStorage');
    } catch (error) {
      console.error('Error al guardar currentUser en localStorage:', error);
    }
    console.log('Usuario establecido en el contexto');
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para actualizar el perfil del usuario
  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  };

  // Objeto con el estado y las funciones que se compartirán
  const value = {
    currentUser,
    login,
    logout,
    updateProfile,
    isAdmin: currentUser?.role === 'admin',
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
