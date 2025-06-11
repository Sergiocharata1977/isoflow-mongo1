// Script para crear las colecciones necesarias para el sistema de autenticación
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'isoflow';

async function createCollections() {
  console.log('Creando colecciones para el sistema de autenticación...');
  
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db(DB_NAME);

    // Crear colección de usuarios
    await db.createCollection('usuarios', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['nombre', 'email', 'password_hash'],
          properties: {
            nombre: { bsonType: 'string' },
            email: { bsonType: 'string' },
            password_hash: { bsonType: 'string' },
            role: { bsonType: 'string', default: 'user' },
            created_at: { bsonType: 'date', default: new Date() },
            updated_at: { bsonType: 'date', default: new Date() }
          }
        }
      }
    });

    // Crear índice único para email
    await db.collection('usuarios').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Colección de usuarios creada correctamente');

    // Crear colección de actividad de usuarios
    await db.createCollection('actividad_usuarios', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['usuario_id', 'tipo'],
          properties: {
            usuario_id: { bsonType: 'objectId' },
            tipo: { bsonType: 'string' },
            descripcion: { bsonType: 'string' },
            fecha: { bsonType: 'date', default: new Date() }
          }
        }
      }
    });
    console.log('✅ Colección de actividad de usuarios creada correctamente');

    // Verificar si hay usuarios creados
    const userCount = await db.collection('usuarios').countDocuments();
    
    if (userCount === 0) {
      // Crear usuario administrador por defecto
      await db.collection('usuarios').insertOne({
        nombre: 'Administrador',
        email: 'admin@isoflow.com',
        password_hash: 'admin123',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log('✅ Usuario administrador creado correctamente');
    } else {
      console.log('ℹ️ Ya existen usuarios en la base de datos');
    }

    console.log('✅ Configuración completada exitosamente');
  } catch (error) {
    console.error('❌ Error al crear las colecciones:', error);
  } finally {
    await client.close();
  }
}

// Ejecutar la función
createCollections(); 