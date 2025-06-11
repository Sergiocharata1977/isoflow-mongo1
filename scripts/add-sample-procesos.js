const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'isoflow';

const sampleProcesos = [
  {
    nombre: 'Gestión de Documentos',
    descripcion: 'Proceso para la gestión y control de documentos del sistema',
    responsable: 'María López',
    departamento: 'Calidad',
    estado: 'activo',
    fecha_inicio: new Date(),
    fecha_revision: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días después
    documentos: [],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    nombre: 'Auditorías Internas',
    descripcion: 'Proceso para la planificación y ejecución de auditorías internas',
    responsable: 'Carlos Rodríguez',
    departamento: 'Calidad',
    estado: 'activo',
    fecha_inicio: new Date(),
    fecha_revision: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 días después
    documentos: [],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    nombre: 'Gestión de No Conformidades',
    descripcion: 'Proceso para el manejo y seguimiento de no conformidades',
    responsable: 'Juan Pérez',
    departamento: 'Calidad',
    estado: 'activo',
    fecha_inicio: new Date(),
    fecha_revision: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días después
    documentos: [],
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function addSampleProcesos() {
  console.log('Agregando procesos de muestra...');
  
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db(DB_NAME);
    const procesosCollection = db.collection('procesos');

    // Crear colección si no existe
    await db.createCollection('procesos', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['nombre', 'descripcion', 'responsable', 'departamento', 'estado'],
          properties: {
            nombre: { bsonType: 'string' },
            descripcion: { bsonType: 'string' },
            responsable: { bsonType: 'string' },
            departamento: { bsonType: 'string' },
            estado: { bsonType: 'string' },
            fecha_inicio: { bsonType: 'date' },
            fecha_revision: { bsonType: 'date' },
            documentos: { bsonType: 'array' },
            created_at: { bsonType: 'date' },
            updated_at: { bsonType: 'date' }
          }
        }
      }
    });

    // Verificar si ya existen procesos de muestra
    const existingProcesos = await procesosCollection.find({
      nombre: { $in: sampleProcesos.map(proceso => proceso.nombre) }
    }).toArray();

    if (existingProcesos.length > 0) {
      console.log('ℹ️ Algunos procesos de muestra ya existen en la base de datos');
      return;
    }

    // Insertar procesos de muestra
    const result = await procesosCollection.insertMany(sampleProcesos);
    console.log(`✅ ${result.insertedCount} procesos de muestra agregados correctamente`);

  } catch (error) {
    console.error('❌ Error al agregar procesos de muestra:', error);
  } finally {
    await client.close();
  }
}

// Ejecutar la función
addSampleProcesos();
