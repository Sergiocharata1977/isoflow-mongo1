import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/objetivos-calidad`;

// Obtener todos los objetivos de calidad
export const getObjetivosCalidad = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los objetivos de calidad:', error);
    throw error;
  }
};

// Obtener un objetivo por ID
export const getObjetivoCalidadById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el objetivo con ID ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo objetivo de calidad
export const createObjetivoCalidad = async (objetivoData) => {
  try {
    const response = await axios.post(API_URL, objetivoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el objetivo de calidad:', error);
    throw error;
  }
};

// Actualizar un objetivo existente
export const updateObjetivoCalidad = async (id, objetivoData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, objetivoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el objetivo con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un objetivo
export const deleteObjetivoCalidad = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el objetivo con ID ${id}:`, error);
    throw error;
  }
};

export default {
  getObjetivosCalidad,
  getObjetivoCalidadById,
  createObjetivoCalidad,
  updateObjetivoCalidad,
  deleteObjetivoCalidad
};
