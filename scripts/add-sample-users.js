// Script para agregar usuarios de muestra a la base de datos
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'isoflow';

const sampleUsers = [
  {
    nombre: 'Juan Pérez',
    email: 'juan@isoflow.com',
    password_hash: 'juan123',
    role: 'supervisor',
    permisos: ['tablero', 'personal', 'documentos', 'procesos'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    nombre: 'María López',
    email: 'maria@isoflow.com',
    password_hash: 'maria123',
    role: 'usuario',
    permisos: ['tablero', 'documentos'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    nombre: 'Carlos Rodríguez',
    email: 'carlos@isoflow.com',
    password_hash: 'carlos123',
    role: 'auditor',
    permisos: ['tablero', 'auditorias', 'documentos'],
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function addSampleUsers() {
  console.log('Agregando usuarios de muestra...');
  
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db(DB_NAME);
    const usuariosCollection = db.collection('usuarios');

    // Verificar si ya existen usuarios de muestra
    const existingUsers = await usuariosCollection.find({
      email: { $in: sampleUsers.map(user => user.email) }
    }).toArray();

    if (existingUsers.length > 0) {
      console.log('ℹ️ Algunos usuarios de muestra ya existen en la base de datos');
      return;
    }

    // Insertar usuarios de muestra
    const result = await usuariosCollection.insertMany(sampleUsers);
    console.log(`✅ ${result.insertedCount} usuarios de muestra agregados correctamente`);

  } catch (error) {
    console.error('❌ Error al agregar usuarios de muestra:', error);
  } finally {
    await client.close();
  }
}

// Ejecutar la función
addSampleUsers();
