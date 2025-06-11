import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/personal/login`, { email, password });
      return response.data; // Devuelve los datos del usuario si el login es exitoso
    } catch (error) {
      // Si el backend devuelve un error específico (ej. 401), axios lo lanzará.
      // Podemos relanzar el error para que el componente de login lo maneje.
      console.error('Error en authService.login:', error.response ? error.response.data : error.message);
      throw error.response ? new Error(error.response.data.error || 'Error de autenticación') : error;
    }
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error al obtener currentUser de localStorage:', error);
      return null;
    }
  },

  logout() {
    // Aquí se podría llamar a un endpoint de backend si existiera
    // Por ahora, solo limpiaremos localStorage
    localStorage.removeItem('currentUser');
    // No es necesario que devuelva una promesa si es síncrono
    // return Promise.resolve(); 
  }
};

export default authService;
