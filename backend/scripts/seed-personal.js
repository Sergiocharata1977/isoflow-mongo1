

import { connectDB, getDB, closeDB } from '../lib/mongoClient.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

// --- Datos de Ejemplo ---
// Para que los datos sean realistas, el script buscará un departamento y un puesto existentes.
// Si no los encuentra, usará valores nulos.

const seedPersonal = async () => {
  let db;
  try {
    await connectDB();
    db = getDB();
    console.log('Conectado a la base de datos para el seeder.');

    // 1. Buscar un departamento y un puesto para usar sus IDs
    const departamentoEjemplo = await db.collection('departamentos').findOne({});
    const puestoEjemplo = await db.collection('puestos').findOne({});

    const departamentoId = departamentoEjemplo ? departamentoEjemplo._id : null;
    const puestoId = puestoEjemplo ? puestoEjemplo._id : null;

    if (!departamentoId || !puestoId) {
      console.warn('ADVERTENCIA: No se encontraron departamentos o puestos. Algunos registros se crearán con IDs nulos.');
    }

    // 2. Hashear contraseñas
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const userPassword = await bcrypt.hash('user123', saltRounds);

    const personalDeEjemplo = [
      {
        nombre: 'Admin',
        apellido: 'Principal',
        email: 'admin@isoflow.com',
        password: adminPassword,
        role: 'admin',
        dni: '11111111',
        legajo: 'A001',
        fechaIngreso: new Date('2020-01-15'),
        departamentoId,
        puestoId,
        createdAt: new Date()
      },
      {
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan.perez@isoflow.com',
        password: userPassword,
        role: 'user',
        dni: '22222222',
        legajo: 'U002',
        fechaIngreso: new Date('2021-05-20'),
        departamentoId,
        puestoId,
        createdAt: new Date()
      },
      {
        nombre: 'Maria',
        apellido: 'Gomez',
        email: null,
        password: null,
        role: null,
        dni: '33333333',
        legajo: 'P003',
        fechaIngreso: new Date('2022-09-01'),
        departamentoId,
        puestoId,
        createdAt: new Date()
      }
    ];

    // 3. Limpiar la colección de personal existente (excepto los que creaste para pruebas si quieres)
    // Para una limpieza total, elimina la condición del $nin.
    console.log('Limpiando la colección de personal...');
    await db.collection('personal').deleteMany({
      email: { $nin: ['testia4@example.com', 'testia5@example.com', 'testia6@example.com'] } // Opcional: no borrar usuarios de prueba
    });

    // 4. Insertar los nuevos datos
    console.log('Insertando datos de ejemplo...');
    const result = await db.collection('personal').insertMany(personalDeEjemplo);
    console.log(`${result.insertedCount} documentos insertados con éxito.`);

    console.log('\n--- Resumen de Usuarios Creados ---');
    console.log('Admin: admin@isoflow.com / pass: admin123');
    console.log('Usuario: juan.perez@isoflow.com / pass: user123');
    console.log('Personal sin acceso: Maria Gomez');
    console.log('------------------------------------');

  } catch (error) {
    console.error('Ocurrió un error durante el seeding:', error);
  } finally {
    if (db) {
      await closeDB();
      console.log('Conexión a la base de datos cerrada.');
    }
  }
};

seedPersonal();
