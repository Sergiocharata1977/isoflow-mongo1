import express from 'express';
import ObjetivoCalidad from '../models/ObjetivoCalidad.js';

const router = express.Router();

// @route   POST /api/objetivos-calidad
// @desc    Crear un nuevo objetivo de calidad
// @access  Private (se añadirá autenticación más adelante)
router.post('/', async (req, res) => {
  try {
    const nuevoObjetivo = new ObjetivoCalidad(req.body);
    const objetivoGuardado = await nuevoObjetivo.save();
    res.status(201).json(objetivoGuardado);
  } catch (error) {
    console.error('Error al crear objetivo de calidad:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// @route   GET /api/objetivos-calidad
// @desc    Obtener todos los objetivos de calidad
// @access  Private
router.get('/', async (req, res) => {
  try {
    const objetivos = await ObjetivoCalidad.find().populate('procesoId', 'nombre'); // Popula el nombre del proceso
    res.status(200).json(objetivos);
  } catch (error) {
    console.error('Error al obtener objetivos de calidad:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// @route   GET /api/objetivos-calidad/:id
// @desc    Obtener un objetivo de calidad por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const objetivo = await ObjetivoCalidad.findById(req.params.id).populate('procesoId', 'nombre');
    if (!objetivo) {
      return res.status(404).json({ message: 'Objetivo de calidad no encontrado' });
    }
    res.status(200).json(objetivo);
  } catch (error) {
    console.error('Error al obtener objetivo de calidad por ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'ID de objetivo de calidad no válido' });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// @route   PUT /api/objetivos-calidad/:id
// @desc    Actualizar un objetivo de calidad
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const objetivoActualizado = await ObjetivoCalidad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('procesoId', 'nombre');
    if (!objetivoActualizado) {
      return res.status(404).json({ message: 'Objetivo de calidad no encontrado para actualizar' });
    }
    res.status(200).json(objetivoActualizado);
  } catch (error) {
    console.error('Error al actualizar objetivo de calidad:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'ID de objetivo de calidad no válido' });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// @route   DELETE /api/objetivos-calidad/:id
// @desc    Eliminar un objetivo de calidad
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const objetivoEliminado = await ObjetivoCalidad.findByIdAndDelete(req.params.id);
    if (!objetivoEliminado) {
      return res.status(404).json({ message: 'Objetivo de calidad no encontrado para eliminar' });
    }
    // Aquí podrías considerar eliminar también los indicadores y mediciones asociados
    res.status(200).json({ message: 'Objetivo de calidad eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar objetivo de calidad:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'ID de objetivo de calidad no válido' });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

export default router;
