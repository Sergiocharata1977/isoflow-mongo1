// backend/scripts/seed-documentos.js
import { connectDB, getDB } from '../lib/mongoClient.js';

const documentosDeEjemplo = [
  {
    codigo: 'DOC-SGC-001',
    nombre: 'Manual de Calidad',
    tipo: 'Manual',
    estado: 'Vigente',
    version: '3.0',
    fechaEmision: new Date('2023-01-15'),
    fechaRevision: new Date('2024-01-10'),
    creadoPor: 'Admin', // Podrías usar ObjectId de un usuario si lo tienes
    aprobadoPor: 'Gerencia',
    descripcion: 'Documento principal del Sistema de Gestión de Calidad.',
    palabrasClave: ['sgc', 'manual', 'calidad', 'iso9001'],
    urlArchivo: '/docs/DOC-SGC-001_v3.0.pdf', // Ruta de ejemplo
  },
  {
    codigo: 'PRO-RH-002',
    nombre: 'Procedimiento de Contratación de Personal',
    tipo: 'Procedimiento',
    estado: 'Vigente',
    version: '1.5',
    fechaEmision: new Date('2023-03-20'),
    fechaRevision: new Date('2023-11-05'),
    creadoPor: 'RRHH',
    aprobadoPor: 'Gerencia RRHH',
    descripcion: 'Describe los pasos para la contratación de nuevo personal.',
    palabrasClave: ['procedimiento', 'rh', 'contratacion', 'personal'],
    urlArchivo: '/docs/PRO-RH-002_v1.5.pdf',
  },
  {
    codigo: 'FOR-COMP-003',
    nombre: 'Formulario de Solicitud de Compra',
    tipo: 'Formulario',
    estado: 'Vigente',
    version: '1.0',
    fechaEmision: new Date('2023-02-01'),
    creadoPor: 'Compras',
    aprobadoPor: 'Jefe de Compras',
    descripcion: 'Formulario estándar para solicitar compras de materiales o servicios.',
    palabrasClave: ['formulario', 'compras', 'solicitud'],
    urlArchivo: '/docs/FOR-COMP-003_v1.0.pdf',
  },
  {
    codigo: 'INS-PROD-004',
    nombre: 'Instructivo de Ensamblaje Producto X',
    tipo: 'Instructivo',
    estado: 'Obsoleto',
    version: '1.0',
    fechaEmision: new Date('2022-05-10'),
    fechaRevision: new Date('2022-10-15'),
    creadoPor: 'Producción',
    aprobadoPor: 'Jefe de Producción',
    descripcion: 'Instructivo para el ensamblaje del Producto X (versión anterior).',
    palabrasClave: ['instructivo', 'produccion', 'ensamblaje', 'obsoleto'],
    urlArchivo: '/docs/INS-PROD-004_v1.0_obsoleto.pdf',
  }
];

async function seedDocumentos() {
  try {
    await connectDB();
    const db = getDB();
    const collection = db.collection('documentos');

    // Opcional: Eliminar documentos existentes para evitar duplicados al re-ejecutar
    // Comenta o descomenta según tu necesidad.
    // console.log('Eliminando documentos existentes...');
    // await collection.deleteMany({});

    console.log('Insertando documentos de ejemplo...');
    // Insertar solo si no existen documentos con el mismo código
    for (const doc of documentosDeEjemplo) {
      const existingDoc = await collection.findOne({ codigo: doc.codigo });
      if (!existingDoc) {
        await collection.insertOne({ ...doc, createdAt: new Date(), updatedAt: new Date() });
        console.log(`Documento "${doc.nombre}" (Código: ${doc.codigo}) insertado.`);
      } else {
        console.log(`Documento "${doc.nombre}" (Código: ${doc.codigo}) ya existe. Omitiendo.`);
      }
    }

    console.log('Proceso de seeding para documentos completado.');
  } catch (error) {
    console.error('Error durante el seeding de documentos:', error);
  } finally {
    // No cerramos la conexión aquí si queremos que el script principal lo haga
    // o si es un script que se ejecuta y termina.
    // Si este script es el único que usa la DB, puedes cerrar la conexión.
    // Por ahora, lo dejamos que el proceso principal termine.
    // await client.close(); // Asumiendo que 'client' es accesible globalmente desde mongoClient.js
    process.exit(0); // Termina el proceso explícitamente
  }
}

seedDocumentos();
