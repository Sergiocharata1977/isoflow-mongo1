// Script para crear las tablas necesarias para el sistema de autenticación
const { createClient } = require('@libsql/client');

// Configuración de la base de datos Turso
const client = createClient({
  url: 'libsql://iso-muestra-104-sergiocharata1977.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDY3OTgzMTUsImlkIjoiYjM2Y2MxYzYtY2I0NC00NzFkLWEyYjYtNGI5MTI0NjQ2MmE4IiwicmlkIjoiZDIyMDRlMGQtMTcxYy00NjhkLTliODUtYzNhYTYzNDlhZmI0In0.6FSA-ozXSMWU5XtSgul4oNQ6nzhA42IyX9emolZusfrO4aGP6xvn0p7cHmBHRtpwlTSxX4Tq-UVWaX5QUtdzAw'
});

async function createTables() {
  console.log('Creando tablas para el sistema de autenticación...');

  try {
    // Crear tabla de usuarios si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
    console.log('✅ Tabla de usuarios creada correctamente');

    // Crear tabla de actividad de usuarios si no existe
    await client.execute(`
      CREATE TABLE IF NOT EXISTS actividad_usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        descripcion TEXT,
        fecha TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
      )
    `);
    console.log('✅ Tabla de actividad de usuarios creada correctamente');

    // Verificar si hay usuarios creados
    const { rows } = await client.execute('SELECT COUNT(*) as count FROM usuarios');
    
    if (rows[0].count === 0) {
      // Crear usuario administrador por defecto
      await client.execute(`
        INSERT INTO usuarios (nombre, email, password_hash, role)
        VALUES ('Administrador', 'admin@isoflow.com', 'admin123', 'admin')
      `);
      console.log('✅ Usuario administrador creado correctamente');
    } else {
      console.log('ℹ️ Ya existen usuarios en la base de datos');
    }

    console.log('✅ Configuración completada exitosamente');
  } catch (error) {
    console.error('❌ Error al crear las tablas:', error);
  }
}

// Ejecutar la función
createTables();
