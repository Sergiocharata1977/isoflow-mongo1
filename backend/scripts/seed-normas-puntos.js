// backend/scripts/seed-normas-puntos.js
import { connectDB, getDB } from '../lib/mongoClient.js';

const normasPuntosDeEjemplo = [
  {
    norma: 'ISO 9001:2015',
    clausula: '4.1',
    titulo: 'Comprensión de la organización y de su contexto',
    descripcion: 'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y su dirección estratégica, y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión de la calidad.',
    tipo: 'Requisito',
    palabrasClave: ['contexto', 'organización', 'partes interesadas', 'sgc'],
  },
  {
    norma: 'ISO 9001:2015',
    clausula: '4.2',
    titulo: 'Comprensión de las necesidades y expectativas de las partes interesadas',
    descripcion: 'La organización debe determinar las partes interesadas que son pertinentes al sistema de gestión de la calidad y los requisitos pertinentes de estas partes interesadas.',
    tipo: 'Requisito',
    palabrasClave: ['partes interesadas', 'necesidades', 'expectativas', 'sgc'],
  },
  {
    norma: 'ISO 9001:2015',
    clausula: '7.1.6',
    titulo: 'Conocimientos de la organización',
    descripcion: 'La organización debe determinar los conocimientos necesarios para la operación de sus procesos y para lograr la conformidad de los productos y servicios.',
    tipo: 'Requisito',
    palabrasClave: ['conocimiento', 'organización', 'procesos', 'competencia'],
  },
  {
    norma: 'ISO 14001:2015',
    clausula: '6.1.2',
    titulo: 'Aspectos ambientales',
    descripcion: 'La organización debe determinar los aspectos ambientales de sus actividades, productos y servicios que puede controlar y aquellos sobre los que puede influir, y sus impactos ambientales asociados, considerando una perspectiva de ciclo de vida.',
    tipo: 'Requisito',
    palabrasClave: ['ambiental', 'aspectos', 'impactos', 'ciclo de vida', 'sga'],
  }
];

async function seedNormasPuntos() {
  try {
    await connectDB();
    const db = getDB();
    const collection = db.collection('normaspuntos'); // Asegúrate que el nombre de la colección sea 'normaspuntos' (minúsculas)

    console.log('Insertando puntos de norma de ejemplo...');
    for (const punto of normasPuntosDeEjemplo) {
      const existingPunto = await collection.findOne({ norma: punto.norma, clausula: punto.clausula });
      if (!existingPunto) {
        await collection.insertOne({ ...punto, createdAt: new Date(), updatedAt: new Date() });
        console.log(`Punto de norma "${punto.titulo}" (Norma: ${punto.norma}, Cláusula: ${punto.clausula}) insertado.`);
      } else {
        console.log(`Punto de norma "${punto.titulo}" (Norma: ${punto.norma}, Cláusula: ${punto.clausula}) ya existe. Omitiendo.`);
      }
    }

    console.log('Proceso de seeding para puntos de norma completado.');
  } catch (error) {
    console.error('Error durante el seeding de puntos de norma:', error);
  } finally {
    process.exit(0);
  }
}

seedNormasPuntos();
