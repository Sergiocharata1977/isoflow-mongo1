import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../lib/mongoClient.js';

const router = express.Router();

const COLLECTION_NAME = 'normaspuntos';

// GET all norm points
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    console.log('[normasPuntos.routes] GET /: db object obtained. DB name:', db ? db.databaseName : 'db is null/undefined');
    if (!db) return res.status(500).json({ message: 'Database connection not available.' });

    const collection = db.collection(COLLECTION_NAME);
    console.log(`[normasPuntos.routes] GET /: Querying collection: ${COLLECTION_NAME}`);

    const count = await collection.countDocuments({});
    console.log(`[normasPuntos.routes] GET /: Found ${count} documents with countDocuments.`);

    const puntos = await collection.find({}).sort({ norma: 1, clausula: 1 }).toArray();
    console.log('[normasPuntos.routes] GET /: Data from toArray():', JSON.stringify(puntos, null, 2));

    res.status(200).json(puntos);
  } catch (error) {
    console.error('Error fetching norm points:', error);
    res.status(500).json({ message: 'Error fetching norm points', error: error.message });
  }
});

// POST a new norm point
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { norma, clausula, titulo, descripcionDetallada, estado } = req.body;

    if (!norma || !clausula || !titulo) {
      return res.status(400).json({ message: 'Norma, Clausula, and Titulo are required fields.' });
    }

    // Check for uniqueness of 'norma' + 'clausula'
    const existingPunto = await db.collection(COLLECTION_NAME).findOne({ norma, clausula });
    if (existingPunto) {
      return res.status(400).json({ message: `Norm point with norma '${norma}' and clausula '${clausula}' already exists.` });
    }

    const newPunto = {
      norma,
      clausula,
      titulo,
      descripcionDetallada: descripcionDetallada || '',
      estado: estado || 'Vigente',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newPunto);
    res.status(201).json({ message: 'Norm point created successfully', puntoId: result.insertedId, ...newPunto });
  } catch (error) {
    console.error('Error creating norm point:', error);
    res.status(500).json({ message: 'Error creating norm point', error: error.message });
  }
});

// GET a single norm point by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Norm Point ID format' });
    }
    const punto = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    if (!punto) {
      return res.status(404).json({ message: 'Norm point not found' });
    }
    res.status(200).json(punto);
  } catch (error) {
    console.error('Error fetching norm point by ID:', error);
    res.status(500).json({ message: 'Error fetching norm point by ID', error: error.message });
  }
});

// PUT (update) a norm point by ID
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Norm Point ID format' });
    }

    const { norma, clausula, titulo, descripcionDetallada, estado } = req.body;

    if (!norma || !clausula || !titulo) {
      return res.status(400).json({ message: 'Norma, Clausula, and Titulo are required fields.' });
    }

    // Check if norm point exists
    const existingPunto = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    if (!existingPunto) {
      return res.status(404).json({ message: 'Norm point not found' });
    }

    // Check for uniqueness of 'norma' + 'clausula' if they are being changed
    if (norma !== existingPunto.norma || clausula !== existingPunto.clausula) {
      const puntoWithNewIdentifiers = await db.collection(COLLECTION_NAME).findOne({ norma, clausula });
      if (puntoWithNewIdentifiers) {
        return res.status(400).json({ message: `Another norm point with norma '${norma}' and clausula '${clausula}' already exists.` });
      }
    }

    const updatedFields = {
      norma,
      clausula,
      titulo,
      descripcionDetallada,
      estado,
      updatedAt: new Date(),
    };

    // Remove undefined fields so they don't overwrite existing values with undefined
    Object.keys(updatedFields).forEach(key => updatedFields[key] === undefined && delete updatedFields[key]);

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Norm point not found (no match for update)' });
    }
    if (result.modifiedCount === 0 && result.matchedCount === 1) {
        return res.status(200).json({ message: 'No changes detected in norm point data.', puntoId: id });
    }

    res.status(200).json({ message: 'Norm point updated successfully', puntoId: id });
  } catch (error) {
    console.error('Error updating norm point:', error);
    res.status(500).json({ message: 'Error updating norm point', error: error.message });
  }
});

// DELETE a norm point by ID
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Norm Point ID format' });
    }
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Norm point not found' });
    }
    res.status(200).json({ message: 'Norm point deleted successfully', puntoId: id });
  } catch (error) {
    console.error('Error deleting norm point:', error);
    res.status(500).json({ message: 'Error deleting norm point', error: error.message });
  }
});

export default router;
