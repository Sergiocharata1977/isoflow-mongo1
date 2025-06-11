import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto de tema
const ThemeContext = createContext();

// Hook personalizado para usar el contexto de tema
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Proveedor del contexto de tema
export function ThemeProvider({ children }) {
  // Verificar si hay una preferencia guardada, o usar la preferencia del sistema
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Verificar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState('light'); // Valor por defecto hasta que se cargue

  // Inicializar el tema cuando se monta el componente
  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  // Actualizar la clase en el elemento html cuando cambia el tema
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Eliminar clase anterior
    root.classList.remove('light', 'dark');
    
    // Añadir nueva clase
    root.classList.add(theme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para cambiar entre temas
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Valores compartidos con el contexto
  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
