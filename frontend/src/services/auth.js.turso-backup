
import { executeQuery } from '@/lib/tursoClient';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} Datos del usuario autenticado
   */
  async login(email, password) {
    // Verificar si existe el usuario y si la contraseña es correcta
    const query = `
      SELECT id, nombre, email, role, password_hash 
      FROM usuarios 
      WHERE email = ?
    `;
    
    const { data, error } = await executeQuery(query, [email]);
    
    if (error) throw new Error('Error al iniciar sesión');
    if (!data || data.rows.length === 0) throw new Error('Usuario no encontrado');
    
    const user = data.rows[0];
    
    // Verificación simple de contraseña (en un entorno real deberías usar bcrypt)
    if (user.password_hash !== password) {
      throw new Error('Contraseña incorrecta');
    }
    
    // Guardar información del usuario en localStorage
    const userData = {
      id: user.id,
      name: user.nombre,
      email: user.email,
      role: user.role || 'user'
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Registrar el inicio de sesión
    this.logUserActivity(user.id, 'login', 'Inicio de sesión');
    
    return userData;
  },

  /**
   * Registra un nuevo usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @param {Object} userData - Datos adicionales del usuario
   * @returns {Object} Datos del usuario registrado
   */
  async register(email, password, userData) {
    // Verificar si el usuario ya existe
    const checkQuery = `SELECT id FROM usuarios WHERE email = ?`;
    const checkResult = await executeQuery(checkQuery, [email]);
    
    if (checkResult.data && checkResult.data.rows.length > 0) {
      throw new Error('El usuario ya existe');
    }
    
    // Crear el nuevo usuario
    const insertQuery = `
      INSERT INTO usuarios (nombre, email, password_hash, role, created_at) 
      VALUES (?, ?, ?, ?, datetime('now'))
      RETURNING id, nombre, email, role
    `;
    
    const { data, error } = await executeQuery(insertQuery, [
      userData.nombre || email.split('@')[0],
      email,
      password, // En un entorno real deberías hashear la contraseña
      userData.role || 'user'
    ]);
    
    if (error) throw new Error('Error al registrar el usuario');
    
    const newUser = data.rows[0];
    return {
      id: newUser.id,
      name: newUser.nombre,
      email: newUser.email,
      role: newUser.role
    };
  },

  /**
   * Cierra la sesión del usuario actual
   */
  async logout() {
    const user = this.getCurrentUser();
    if (user) {
      // Registrar la salida
      await this.logUserActivity(user.id, 'logout', 'Cierre de sesión');
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
   * Actualiza el perfil del usuario
   * @param {Object} userData - Nuevos datos del usuario
   * @returns {Object} Datos actualizados
   */
  async updateProfile(userData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('No hay una sesión activa');
    
    const updateQuery = `
      UPDATE usuarios 
      SET nombre = ?, role = ?
      WHERE id = ?
      RETURNING id, nombre, email, role
    `;
    
    const { data, error } = await executeQuery(updateQuery, [
      userData.nombre || currentUser.name,
      userData.role || currentUser.role,
      currentUser.id
    ]);
    
    if (error) throw new Error('Error al actualizar el perfil');
    
    const updatedUser = data.rows[0];
    const newUserData = {
      id: updatedUser.id,
      name: updatedUser.nombre,
      email: updatedUser.email,
      role: updatedUser.role
    };
    
    // Actualizar localStorage
    localStorage.setItem('user', JSON.stringify(newUserData));
    
    return newUserData;
  },

  /**
   * Registra una actividad del usuario
   * @param {number} userId - ID del usuario
   * @param {string} tipo - Tipo de actividad (login, logout, etc)
   * @param {string} descripcion - Descripción de la actividad
   */
  async logUserActivity(userId, tipo, descripcion) {
    const query = `
      INSERT INTO actividad_usuarios (usuario_id, tipo, descripcion, fecha)
      VALUES (?, ?, ?, datetime('now'))
    `;
    
    await executeQuery(query, [userId, tipo, descripcion]);
  }
};
