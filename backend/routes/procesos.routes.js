// backend/routes/procesos.routes.js
import express from 'express';
import { getDB } from '../lib/mongoClient.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const COLLECTION_NAME = 'procesos';

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

// GET /api/procesos - Listar todos los procesos
router.get('/', async (req, res) => {
  try {
    const procesos = await req.collection.find({}).toArray();
    res.json(procesos);
  } catch (error) {
    console.error('Error al obtener los procesos:', error);
    res.status(500).json({ message: 'Error al obtener los procesos' });
  }
});

// GET /api/procesos/:id - Obtener un proceso por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de proceso inválido.' });
    }

    const proceso = await req.collection.findOne({ _id: new ObjectId(id) });
    
    if (!proceso) {
      return res.status(404).json({ message: 'Proceso no encontrado.' });
    }
    
    res.json(proceso);
  } catch (error) {
    console.error('Error al obtener el proceso:', error);
    res.status(500).json({ message: 'Error al obtener el proceso' });
  }
});

// POST /api/procesos - Crear un nuevo proceso
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, responsable, departamento, fechaCreacion, estado } = req.body;
    
    // Validación básica
    if (!nombre || !descripcion || !responsable) {
      return res.status(400).json({ 
        message: 'Los campos nombre, descripción y responsable son obligatorios.' 
      });
    }

    const nuevoProceso = {
      nombre,
      descripcion,
      responsable,
      departamento: departamento || '',
      fechaCreacion: fechaCreacion || new Date(),
      estado: estado || 'activo',
      fechaActualizacion: new Date()
    };

    const resultado = await req.collection.insertOne(nuevoProceso);
    
    res.status(201).json({
      _id: resultado.insertedId,
      ...nuevoProceso
    });
  } catch (error) {
    console.error('Error al crear el proceso:', error);
    res.status(500).json({ message: 'Error al crear el proceso' });
  }
});

// PUT /api/procesos/:id - Actualizar un proceso existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de proceso inválido.' });
    }

    const { nombre, descripcion, responsable, departamento, estado } = req.body;
    const actualizacion = {
      $set: {
        ...(nombre && { nombre }),
        ...(descripcion && { descripcion }),
        ...(responsable && { responsable }),
        ...(departamento && { departamento }),
        ...(estado && { estado }),
        fechaActualizacion: new Date()
      }
    };

    const resultado = await req.collection.updateOne(
      { _id: new ObjectId(id) },
      actualizacion
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ message: 'Proceso no encontrado.' });
    }

    res.json({ message: 'Proceso actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el proceso:', error);
    res.status(500).json({ message: 'Error al actualizar el proceso' });
  }
});

// DELETE /api/procesos/:id - Eliminar un proceso
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de proceso inválido.' });
    }

    const resultado = await req.collection.deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ message: 'Proceso no encontrado.' });
    }

    res.json({ message: 'Proceso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el proceso:', error);
    res.status(500).json({ message: 'Error al eliminar el proceso' });
  }
});

export default router;
