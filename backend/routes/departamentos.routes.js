// backend/routes/departamentos.routes.js
import express from 'express';
import { getDB } from '../lib/mongoClient.js'; // Helper para obtener la instancia de la DB
import { ObjectId } from 'mongodb'; // Para convertir strings a ObjectId de MongoDB

const router = express.Router();
const COLLECTION_NAME = 'departamentos';

// Middleware para obtener la colección dinámicamente
const getCollection = (req, res, next) => {
  try {
    const db = getDB();
    if (!db) {
      // Esto podría pasar si la conexión a la DB falló al inicio
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

router.use(getCollection); // Aplicar a todas las rutas de este router

// GET /api/departamentos - Listar todos los departamentos
router.get('/', async (req, res) => {
  try {
    const departamentos = await req.collection.find({}).sort({ nombre: 1 }).toArray(); // Ordenar por nombre
    res.json(departamentos);
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({ message: 'Error al obtener los departamentos de la base de datos.', error: error.message });
  }
});

// POST /api/departamentos - Crear un nuevo departamento
router.post('/', async (req, res) => {
  try {
    const nuevoDepartamento = req.body;
    // Validación básica
    if (!nuevoDepartamento.nombre || typeof nuevoDepartamento.nombre !== 'string' || nuevoDepartamento.nombre.trim() === '') {
      return res.status(400).json({ message: 'El campo "nombre" es requerido y debe ser una cadena de texto no vacía.' });
    }
    
    const departamentoAInsertar = {
      nombre: nuevoDepartamento.nombre.trim(),
      descripcion: nuevoDepartamento.descripcion ? nuevoDepartamento.descripcion.trim() : '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await req.collection.insertOne(departamentoAInsertar);
    const insertedDoc = await req.collection.findOne({ _id: result.insertedId });
    res.status(201).json(insertedDoc);

  } catch (error) {
    console.error('Error al crear departamento:', error);
    if (error.code === 11000) { 
        return res.status(409).json({ message: 'Ya existe un departamento con ese nombre.', error: error.message });
    }
    res.status(500).json({ message: 'Error al crear el departamento en la base de datos.', error: error.message });
  }
});

// GET /api/departamentos/:id - Obtener un departamento por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de departamento inválido.' });
    }
    const departamento = await req.collection.findOne({ _id: new ObjectId(id) });
    if (!departamento) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }
    res.json(departamento);
  } catch (error) {
    console.error('Error al obtener departamento por ID:', error);
    res.status(500).json({ message: 'Error al obtener el departamento de la base de datos.', error: error.message });
  }
});

// PUT /api/departamentos/:id - Actualizar un departamento por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de departamento inválido.' });
    }
    const datosActualizacion = req.body;
    
    const updateFields = {};
    if (datosActualizacion.nombre && typeof datosActualizacion.nombre === 'string' && datosActualizacion.nombre.trim() !== '') {
      updateFields.nombre = datosActualizacion.nombre.trim();
    }
    if (typeof datosActualizacion.descripcion === 'string') { // Permitir descripción vacía
      updateFields.descripcion = datosActualizacion.descripcion.trim();
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos válidos para actualizar (nombre o descripción).' });
    }
    updateFields.updatedAt = new Date();

    const updateDoc = { $set: updateFields };

    const result = await req.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateDoc,
      { returnDocument: 'after' } // Devuelve el documento actualizado
    );

    if (!result || !result.value) { // En MongoDB Node.js driver v4+, findOneAndUpdate devuelve un objeto con 'value' para el doc
      return res.status(404).json({ message: 'Departamento no encontrado para actualizar.' });
    }
    
    res.json(result.value);
  } catch (error) {
    console.error('Error al actualizar departamento:', error);
     if (error.code === 11000) { 
        return res.status(409).json({ message: 'Error de conflicto, el nombre del departamento ya existe.', error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar el departamento en la base de datos.', error: error.message });
  }
});

// DELETE /api/departamentos/:id - Eliminar un departamento por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de departamento inválido.' });
    }
    const result = await req.collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Departamento no encontrado para eliminar.' });
    }
    res.status(200).json({ message: 'Departamento eliminado correctamente.', id });
  } catch (error) {
    console.error('Error al eliminar departamento:', error);
    res.status(500).json({ message: 'Error al eliminar el departamento de la base de datos.', error: error.message });
  }
});

export default router;
