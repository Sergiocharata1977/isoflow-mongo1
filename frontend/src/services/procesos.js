import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/procesos`;

// Obtener todos los procesos
export const getProcesos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los procesos:', error);
    throw error;
  }
};

// Obtener un proceso por ID
export const getProcesoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el proceso con ID ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo proceso
export const createProceso = async (procesoData) => {
  try {
    const response = await axios.post(API_URL, procesoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el proceso:', error);
    throw error;
  }
};

// Actualizar un proceso existente
export const updateProceso = async (id, procesoData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, procesoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el proceso con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un proceso
export const deleteProceso = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el proceso con ID ${id}:`, error);
    throw error;
  }
};

export default {
  getProcesos,
  getProcesoById,
  createProceso,
  updateProceso,
  deleteProceso
};
