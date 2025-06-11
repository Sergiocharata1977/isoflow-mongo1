// Archivo de índice para exportar todos los servicios
import personalService from './personalService.js';
import auditoriasService from './auditoriasService.js';
import documentosService from './documentosService.js';
import eventosService from './eventosService.js';

// Importar servicios con formato de objeto (estilo axios)
import { departamentosService } from './departamentos.js';
import { puestosService } from './puestos.js';
import { normasService } from './normas.js';
import { usuariosService } from './usuarios.js';

// Verificar la URL de API correcta
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
console.log('Usando API URL:', API_URL);

// Exportar todos los servicios por nombre
export {
  // Servicios estilo función
  personalService,
  auditoriasService,
  documentosService,
  eventosService,
  
  // Servicios estilo objeto
  departamentosService,
  puestosService,
  normasService,
  usuariosService,
};

// Exportación por defecto de todos los servicios
export default {
  // Servicios estilo función
  personal: personalService,
  auditorias: auditoriasService,
  documentos: documentosService,
  eventos: eventosService,
  
  // Servicios estilo objeto
  departamentos: departamentosService,
  puestos: puestosService,
  normativas: normasService,
  usuarios: usuariosService,
  
  // URL de API para referencia
  apiUrl: API_URL
};
