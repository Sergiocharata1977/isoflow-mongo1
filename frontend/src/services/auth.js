// Servicio de autenticación SIMULADO mientras se implementa el backend de MongoDB
import { jwtDecode } from 'jwt-decode';

// Usuarios simulados para desarrollo
const MOCK_USERS = [
  {
    id: 'admin123',
    name: 'Admin',
    email: 'admin@ejemplo.com',
    password: 'admin', // En producción NUNCA almacenar passwords en texto plano
    role: 'admin'
  },
  {
    id: 'user456',
    name: 'Usuario Normal',
    email: 'usuario@ejemplo.com',
    password: 'password123',
    role: 'user'
  }
];

export const authService = {
  /**
   * Inicia sesión con email y contraseña (versión simulada)
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} Datos del usuario autenticado
   */
  async login(email, password) {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Buscar usuario
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    if (user.password !== password) {
      throw new Error('Contraseña incorrecta');
    }
    
    // Crear datos de usuario sin el password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15)
    };
    
    // Almacenar en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Registrar actividad de forma simulada
    console.log('Actividad registrada: login de ' + user.email);
    
    return userData;
  },

  /**
   * Registra un nuevo usuario (versión simulada)
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @param {Object} userData - Datos adicionales del usuario
   * @returns {Object} Datos del usuario registrado
   */
  async register(email, password, userData) {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verificar si el usuario ya existe
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('El usuario ya existe');
    }
    
    // Crear nuevo usuario
    const newUser = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      name: userData.nombre || email.split('@')[0],
      email,
      password, // En producción NUNCA almacenar passwords en texto plano
      role: userData.role || 'user'
    };
    
    // Agregar a la lista de usuarios (en memoria)
    MOCK_USERS.push(newUser);
    
    // Devolver datos sin el password
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
  },

  /**
   * Cierra la sesión del usuario actual (versión simulada)
   */
  async logout() {
    const user = this.getCurrentUser();
    if (user) {
      console.log('Actividad registrada: logout de ' + user.email);
    }
    localStorage.removeItem('user');
  },

  /**
   * Obtiene el usuario actual desde localStorage
   * @returns {Object|null} Usuario actual o null si no hay sesión
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  },

  /**
   * Actualiza el perfil del usuario (versión simulada)
   * @param {Object} userData - Nuevos datos del usuario
   * @returns {Object} Datos actualizados
   */
  async updateProfile(userData) {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('No hay una sesión activa');
    
    // Actualizar datos
    const newUserData = {
      ...currentUser,
      name: userData.nombre || currentUser.name,
      role: userData.role || currentUser.role
    };
    
    // Actualizar localStorage
    localStorage.setItem('user', JSON.stringify(newUserData));
    
    // Si tuviéramos la lista de usuarios en memoria, actualizaríamos también ahí
    console.log('Perfil actualizado para:', currentUser.email);
    
    return newUserData;
  },

  /**
   * Registra una actividad del usuario (versión simulada)
   * @param {string} userId - ID del usuario
   * @param {string} tipo - Tipo de actividad (login, logout, etc)
   * @param {string} descripcion - Descripción de la actividad
   */
  async logUserActivity(userId, tipo, descripcion) {
    console.log(`Actividad simulada - Usuario: ${userId}, Tipo: ${tipo}, Descripción: ${descripcion}`);
    // No hace nada en esta versión simulada, solo registra en consola
  }
};
