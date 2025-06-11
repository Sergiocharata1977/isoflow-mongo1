// backend/routes/puestos.routes.js
import express from 'express';
import { getDB } from '../lib/mongoClient.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const COLLECTION_NAME = 'puestos';

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

// GET /api/puestos - Listar todos los puestos
router.get('/', async (req, res) => {
  try {
    // Opcional: agregar lookup para popular datos del departamento
    const puestos = await req.collection.aggregate([
      {
        $lookup: {
          from: 'departamentos', // La colección a la que unirse
          localField: 'departamentoId',
          foreignField: '_id',
          as: 'departamentoInfo'
        }
      },
      {
        $unwind: {
          path: '$departamentoInfo',
          preserveNullAndEmptyArrays: true // Mantener puestos incluso si departamentoId es nulo o no coincide
        }
      },
      {
        $project: { // Seleccionar y renombrar campos
          _id: 1,
          nombre: 1,
          descripcion: 1,
          departamentoId: 1,
          departamentoNombre: '$departamentoInfo.nombre', // Obtener el nombre del departamento
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $sort: { nombre: 1 } // Ordenar por nombre del puesto
      }
    ]).toArray();
    res.json(puestos);
  } catch (error) {
    console.error('Error al obtener puestos:', error);
    res.status(500).json({ message: 'Error al obtener los puestos de la base de datos.', error: error.message });
  }
});

// POST /api/puestos - Crear un nuevo puesto
router.post('/', async (req, res) => {
  try {
    const nuevoPuesto = req.body;
    if (!nuevoPuesto.nombre || typeof nuevoPuesto.nombre !== 'string' || nuevoPuesto.nombre.trim() === '') {
      return res.status(400).json({ message: 'El campo "nombre" es requerido.' });
    }
    if (!nuevoPuesto.departamentoId || !ObjectId.isValid(nuevoPuesto.departamentoId)) {
      return res.status(400).json({ message: 'El campo "departamentoId" es requerido y debe ser un ObjectId válido.' });
    }

    // Verificar que el departamentoId existe
    const db = getDB();
    const departamento = await db.collection('departamentos').findOne({ _id: new ObjectId(nuevoPuesto.departamentoId) });
    if (!departamento) {
      return res.status(404).json({ message: 'Departamento especificado no encontrado.'});
    }

    const puestoAInsertar = {
      nombre: nuevoPuesto.nombre.trim(),
      descripcion: nuevoPuesto.descripcion ? nuevoPuesto.descripcion.trim() : '',
      departamentoId: new ObjectId(nuevoPuesto.departamentoId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await req.collection.insertOne(puestoAInsertar);
    const insertedDoc = await req.collection.findOne({ _id: result.insertedId });
    res.status(201).json(insertedDoc);
  } catch (error) {
    console.error('Error al crear puesto:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Ya existe un puesto con ese nombre (posiblemente en el mismo departamento si hay un índice compuesto).', error: error.message });
    }
    res.status(500).json({ message: 'Error al crear el puesto en la base de datos.', error: error.message });
  }
});

// GET /api/puestos/:id - Obtener un puesto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de puesto inválido.' });
    }
    // const puesto = await req.collection.findOne({ _id: new ObjectId(id) });
    const puestoArray = await req.collection.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'departamentos',
          localField: 'departamentoId',
          foreignField: '_id',
          as: 'departamentoInfo'
        }
      },
      {
        $unwind: {
          path: '$departamentoInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1, nombre: 1, descripcion: 1, departamentoId: 1,
          departamentoNombre: '$departamentoInfo.nombre',
          createdAt: 1, updatedAt: 1
        }
      }
    ]).toArray();

    if (!puestoArray || puestoArray.length === 0) {
      return res.status(404).json({ message: 'Puesto no encontrado.' });
    }
    res.json(puestoArray[0]);
  } catch (error) {
    console.error('Error al obtener puesto por ID:', error);
    res.status(500).json({ message: 'Error al obtener el puesto de la base de datos.', error: error.message });
  }
});

// PUT /api/puestos/:id - Actualizar un puesto por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de puesto inválido.' });
    }
    const datosActualizacion = req.body;
    const updateFields = {};

    if (datosActualizacion.nombre && typeof datosActualizacion.nombre === 'string' && datosActualizacion.nombre.trim() !== '') {
      updateFields.nombre = datosActualizacion.nombre.trim();
    }
    if (typeof datosActualizacion.descripcion === 'string') {
      updateFields.descripcion = datosActualizacion.descripcion.trim();
    }
    if (datosActualizacion.departamentoId) {
      if (!ObjectId.isValid(datosActualizacion.departamentoId)) {
        return res.status(400).json({ message: 'El campo "departamentoId" proporcionado es inválido.' });
      }
      // Verificar que el nuevo departamentoId existe
      const db = getDB();
      const departamento = await db.collection('departamentos').findOne({ _id: new ObjectId(datosActualizacion.departamentoId) });
      if (!departamento) {
        return res.status(404).json({ message: 'Departamento especificado para la actualización no encontrado.'});
      }
      updateFields.departamentoId = new ObjectId(datosActualizacion.departamentoId);
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos válidos para actualizar.' });
    }
    updateFields.updatedAt = new Date();

    const updateDoc = { $set: updateFields };
    const result = await req.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateDoc,
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      return res.status(404).json({ message: 'Puesto no encontrado para actualizar.' });
    }
    res.json(result.value);
  } catch (error) {
    console.error('Error al actualizar puesto:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Error de conflicto, el nombre del puesto ya existe (posiblemente).', error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar el puesto en la base de datos.', error: error.message });
  }
});

// DELETE /api/puestos/:id - Eliminar un puesto por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de puesto inválido.' });
    }
    const result = await req.collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Puesto no encontrado para eliminar.' });
    }
    res.status(200).json({ message: 'Puesto eliminado correctamente.', id });
  } catch (error) {
    console.error('Error al eliminar puesto:', error);
    res.status(500).json({ message: 'Error al eliminar el puesto de la base de datos.', error: error.message });
  }
});

export default router;
