// Servicio para el módulo de Puestos (Positions)
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export const puestosService = {
    // Obtener todos los puestos
    async getAll() {
        try {
            const response = await axios.get(`${API_URL}/puestos`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener puestos:', error);
            throw error;
        }
    },

    // Obtener un puesto por ID
    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/puestos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener puesto ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo puesto
    async create(puesto) {
        try {
            const response = await axios.post(`${API_URL}/puestos`, puesto);
            return response.data;
        } catch (error) {
            console.error('Error al crear puesto:', error);
            throw error;
        }
    },

    // Actualizar un puesto existente
    async update(id, puesto) {
        try {
            const response = await axios.put(`${API_URL}/puestos/${id}`, puesto);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar puesto ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un puesto
    async delete(id) {
        try {
            const response = await axios.delete(`${API_URL}/puestos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar puesto ${id}:`, error);
            throw error;
        }
    },

    // Obtener empleados por puesto
    async getEmpleadosByPuesto(id) {
        try {
            const response = await axios.get(`${API_URL}/puestos/${id}/empleados`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener empleados del puesto ${id}:`, error);
            throw error;
        }
    },

    // Obtener puestos por departamento
    async getPuestosByDepartamento(departamentoId) {
        try {
            const response = await axios.get(`${API_URL}/puestos/departamento/${departamentoId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener puestos del departamento ${departamentoId}:`, error);
            throw error;
        }
    }
};

// También exportamos como default para mantener compatibilidad
export default puestosService;
