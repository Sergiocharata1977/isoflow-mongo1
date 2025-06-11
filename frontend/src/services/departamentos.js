// Servicio para el módulo de Departamentos
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export const departamentosService = {
    // Obtener todos los departamentos
    async getAll() {
        try {
            const response = await axios.get(`${API_URL}/departamentos`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener departamentos:', error);
            throw error;
        }
    },

    // Obtener un departamento por ID
    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/departamentos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener departamento ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo departamento
    async create(departamento) {
        try {
            const response = await axios.post(`${API_URL}/departamentos`, departamento);
            return response.data;
        } catch (error) {
            console.error('Error al crear departamento:', error);
            throw error;
        }
    },

    // Actualizar un departamento existente
    async update(id, departamento) {
        try {
            const response = await axios.put(`${API_URL}/departamentos/${id}`, departamento);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar departamento ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un departamento
    async delete(id) {
        try {
            const response = await axios.delete(`${API_URL}/departamentos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar departamento ${id}:`, error);
            throw error;
        }
    },

    // Obtener empleados por departamento
    async getEmpleadosByDepartamento(id) {
        try {
            const response = await axios.get(`${API_URL}/departamentos/${id}/empleados`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener empleados del departamento ${id}:`, error);
            throw error;
        }
    }
};

// También exportamos como default para mantener compatibilidad
export default departamentosService;
