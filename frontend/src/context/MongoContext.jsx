import { createContext, useContext } from 'react';
import * as services from '../services';

// Contexto simple para reemplazar el anterior TursoContext
const MongoContext = createContext();

// Hook para usar el contexto
export const useMongo = () => useContext(MongoContext);

// Proveedor del contexto
export const MongoProvider = ({ children }) => {
  // Validar que estamos usando la URL de API correcta
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
  
  // Valor del contexto simplificado
  const value = {
    isLoading: false,
    error: null,
    dbConnected: true,
    apiUrl: API_URL,
    services,
    
    // Servicios específicos (compatible con ambos formatos - función y objeto)
    personalService: services.personalService,
    auditoriasService: services.auditoriasService,
    documentosService: services.documentosService,
    eventosService: services.eventosService,
    
    // Servicios con formato de objeto
    usuariosService: services.usuariosService,
    departamentosService: services.departamentosService,
    puestosService: services.puestosService,
    normasService: services.normasService,
    
    // Manejador de peticiones generalizado
    handleRequest: async (requestFn) => {
      try {
        return await requestFn();
      } catch (error) {
        console.error('Error en la petición:', error);
        return { error: error.message || 'Error desconocido' };
      }
    },
    // Función para limpiar errores
    clearError: () => {}
  };

  return (
    <MongoContext.Provider value={value}>
      {children}
    </MongoContext.Provider>
  );
};

export default MongoContext;
