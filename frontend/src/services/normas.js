// Servicio para el módulo de Normas
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export const normasService = {
    // Obtener todas las normas
    async getAll() {
        try {
            const response = await axios.get(`${API_URL}/normas`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener normas:', error);
            throw error;
        }
    },

    // Obtener una norma por ID
    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/normas/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener norma ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva norma
    async create(norma) {
        try {
            const response = await axios.post(`${API_URL}/normas`, norma);
            return response.data;
        } catch (error) {
            console.error('Error al crear norma:', error);
            throw error;
        }
    },

    // Actualizar una norma existente
    async update(id, norma) {
        try {
            const response = await axios.put(`${API_URL}/normas/${id}`, norma);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar norma ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una norma
    async delete(id) {
        try {
            const response = await axios.delete(`${API_URL}/normas/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar norma ${id}:`, error);
            throw error;
        }
    },

    // Obtener normas por tipo
    async getByTipo(tipo) {
        try {
            const response = await axios.get(`${API_URL}/normas/tipo/${tipo}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener normas de tipo ${tipo}:`, error);
            throw error;
        }
    },

    // Obtener normas por departamento
    async getByDepartamento(departamentoId) {
        try {
            const response = await axios.get(`${API_URL}/normas/departamento/${departamentoId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener normas del departamento ${departamentoId}:`, error);
            throw error;
        }
    },

    // Subir documento de norma
    async uploadDocumento(id, file) {
        try {
            const formData = new FormData();
            formData.append('documento', file);
            const response = await axios.post(`${API_URL}/normas/${id}/documento`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error al subir documento para norma ${id}:`, error);
            throw error;
        }
    },

    // Descargar documento de norma
    async downloadDocumento(id) {
        try {
            const response = await axios.get(`${API_URL}/normas/${id}/documento`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error(`Error al descargar documento de norma ${id}:`, error);
            throw error;
        }
    }
};

// También exportamos como default para mantener compatibilidad
export default normasService;
