// backend/routes/objetivos-calidad.routes.js
import express from 'express';
import { getDB } from '../lib/mongoClient.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const COLLECTION_NAME = 'objetivosCalidad';

// Middleware para obtener la colección dinámicamente
const getCollection = (req, res, next) => {
  try {
    const db = getDB();
    if (!db) {
      console.error('Error: La instancia de la base de datos no está disponible.');
      return res.status(500).json({ message: 'Error interno del servidor: la base de datos no está conectada.' });
    }
    req.collection = db.collection(COLLECTION_NAME);
    next();
  } catch (error) {
    console.error('Error getting database collection:', error);
    res.status(500).json({ message: 'Error interno del servidor al acceder a la base de datos.' });
  }
};

router.use(getCollection);

// GET /api/objetivos-calidad - Listar todos los objetivos de calidad
router.get('/', async (req, res) => {
  try {
    const { procesoId } = req.query;
    const query = {};

    if (procesoId) {
      if (!ObjectId.isValid(procesoId)) {
        return res.status(400).json({ message: 'ID de proceso inválido.' });
      }
      query.procesoId = new ObjectId(procesoId);
    }

    const objetivos = await req.collection.find(query).toArray();
    res.json(objetivos);
  } catch (error) {
    console.error('Error al obtener los objetivos de calidad:', error);
    res.status(500).json({ message: 'Error al obtener los objetivos de calidad' });
  }
});

// GET /api/objetivos-calidad/:id - Obtener un objetivo por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de objetivo inválido.' });
    }

    const objetivo = await req.collection.findOne({ _id: new ObjectId(id) });
    
    if (!objetivo) {
      return res.status(404).json({ message: 'Objetivo de calidad no encontrado.' });
    }
    
    res.json(objetivo);
  } catch (error) {
    console.error('Error al obtener el objetivo de calidad:', error);
    res.status(500).json({ message: 'Error al obtener el objetivo de calidad' });
  }
});

// POST /api/objetivos-calidad - Crear un nuevo objetivo de calidad
router.post('/', async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      responsable, 
      fechaInicio, 
      fechaObjetivo, 
      indicadores,
      estado,
      procesoId // Añadimos procesoId
    } = req.body;
    
    // Validación básica
    if (!nombre || !descripcion || !responsable || !procesoId) {
      return res.status(400).json({ 
        message: 'Los campos nombre, descripción, responsable y procesoId son obligatorios.' 
      });
    }

    if (!ObjectId.isValid(procesoId)) {
      return res.status(400).json({ message: 'ID de proceso inválido.' });
    }


    const nuevoObjetivo = {
      procesoId: new ObjectId(procesoId), // Guardamos la referencia al proceso
      nombre,
      descripcion,
      responsable,
      fechaInicio: fechaInicio || new Date(),
      fechaObjetivo: fechaObjetivo || null,
      indicadores: indicadores || [],
      estado: estado || 'en_progreso',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    const resultado = await req.collection.insertOne(nuevoObjetivo);
    
    res.status(201).json({
      _id: resultado.insertedId,
      ...nuevoObjetivo
    });
  } catch (error) {
    console.error('Error al crear el objetivo de calidad:', error);
    res.status(500).json({ message: 'Error al crear el objetivo de calidad' });
  }
});

// PUT /api/objetivos-calidad/:id - Actualizar un objetivo existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de objetivo inválido.' });
    }

    const { 
      nombre, 
      descripcion, 
      responsable, 
      fechaInicio, 
      fechaObjetivo, 
      indicadores,
      estado 
    } = req.body;

    const actualizacion = {
      $set: {
        ...(nombre && { nombre }),
        ...(descripcion && { descripcion }),
        ...(responsable && { responsable }),
        ...(fechaInicio && { fechaInicio }),
        ...(fechaObjetivo && { fechaObjetivo }),
        ...(indicadores && { indicadores }),
        ...(estado && { estado }),
        fechaActualizacion: new Date()
      }
    };

    const resultado = await req.collection.updateOne(
      { _id: new ObjectId(id) },
      actualizacion
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ message: 'Objetivo de calidad no encontrado.' });
    }

    res.json({ message: 'Objetivo de calidad actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el objetivo de calidad:', error);
    res.status(500).json({ message: 'Error al actualizar el objetivo de calidad' });
  }
});

// DELETE /api/objetivos-calidad/:id - Eliminar un objetivo de calidad
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de objetivo inválido.' });
    }

    const resultado = await req.collection.deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ message: 'Objetivo de calidad no encontrado.' });
    }

    res.json({ message: 'Objetivo de calidad eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el objetivo de calidad:', error);
    res.status(500).json({ message: 'Error al eliminar el objetivo de calidad' });
  }
});

export default router;
