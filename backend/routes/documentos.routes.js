import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../lib/mongoClient.js';

const router = express.Router();

const COLLECTION_NAME = 'documentos';

// GET all documents
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const documentos = await db.collection(COLLECTION_NAME).find({}).sort({ nombre: 1 }).toArray();
    res.status(200).json(documentos);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
});

// POST a new document
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { nombre, codigo, version, fechaAprobacion, estado, tipoDocumento, procesoAsociado, archivoUrl } = req.body;

    if (!nombre || !codigo) {
      return res.status(400).json({ message: 'Nombre and Codigo are required fields.' });
    }

    // Check for uniqueness of 'codigo'
    const existingDocumentByCodigo = await db.collection(COLLECTION_NAME).findOne({ codigo });
    if (existingDocumentByCodigo) {
      return res.status(400).json({ message: `Document with codigo '${codigo}' already exists.` });
    }

    const newDocument = {
      nombre,
      codigo,
      version: version || '',
      fechaAprobacion: fechaAprobacion ? new Date(fechaAprobacion) : null,
      estado: estado || 'Borrador',
      tipoDocumento: tipoDocumento || '',
      procesoAsociado: procesoAsociado || '',
      archivoUrl: archivoUrl || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newDocument);
    res.status(201).json({ message: 'Document created successfully', documentId: result.insertedId, ...newDocument });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ message: 'Error creating document', error: error.message });
  }
});

// GET a single document by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Document ID format' });
    }
    const document = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document by ID:', error);
    res.status(500).json({ message: 'Error fetching document by ID', error: error.message });
  }
});

// PUT (update) a document by ID
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Document ID format' });
    }

    const { nombre, codigo, version, fechaAprobacion, estado, tipoDocumento, procesoAsociado, archivoUrl } = req.body;

    if (!nombre || !codigo) {
      return res.status(400).json({ message: 'Nombre and Codigo are required fields.' });
    }

    // Check if document exists
    const existingDocument = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    if (!existingDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check for uniqueness of 'codigo' if it's being changed
    if (codigo !== existingDocument.codigo) {
      const documentWithNewCodigo = await db.collection(COLLECTION_NAME).findOne({ codigo });
      if (documentWithNewCodigo) {
        return res.status(400).json({ message: `Another document with codigo '${codigo}' already exists.` });
      }
    }

    const updatedFields = {
      nombre,
      codigo,
      version,
      fechaAprobacion: fechaAprobacion ? new Date(fechaAprobacion) : existingDocument.fechaAprobacion,
      estado,
      tipoDocumento,
      procesoAsociado,
      archivoUrl,
      updatedAt: new Date(),
    };

    // Remove undefined fields so they don't overwrite existing values with undefined
    Object.keys(updatedFields).forEach(key => updatedFields[key] === undefined && delete updatedFields[key]);

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Document not found (no match for update)' });
    }
    if (result.modifiedCount === 0 && result.matchedCount === 1) {
        return res.status(200).json({ message: 'No changes detected in document data.', documentId: id });
    }

    res.status(200).json({ message: 'Document updated successfully', documentId: id });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Error updating document', error: error.message });
  }
});

// DELETE a document by ID
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Document ID format' });
    }
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json({ message: 'Document deleted successfully', documentId: id });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
});

export default router;
