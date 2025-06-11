import express from 'express';
import mongoose from 'mongoose';
import IndicadorCalidad from '../models/IndicadorCalidad.js';
import ObjetivoCalidad from '../models/ObjetivoCalidad.js';

const router = express.Router();

// Middleware para validar que el ID de MongoDB es válido
const validateMongoId = (req, res, next) => {
  const id = req.params.id || req.params.objetivoId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }
  next();
};

// GET /api/indicadores-calidad/objetivo/:objetivoId - Obtener todos los indicadores de un objetivo
router.get('/objetivo/:objetivoId', validateMongoId, async (req, res) => {
  try {
    const indicadores = await IndicadorCalidad.find({ objetivoCalidadId: req.params.objetivoId });
    res.json(indicadores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los indicadores.', error: error.message });
  }
});

// GET /api/indicadores-calidad/:id - Obtener un indicador por ID
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const indicador = await IndicadorCalidad.findById(req.params.id).populate('objetivoCalidadId', 'nombre');
    if (!indicador) {
      return res.status(404).json({ message: 'Indicador no encontrado.' });
    }
    res.json(indicador);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el indicador.', error: error.message });
  }
});

// POST /api/indicadores-calidad - Crear un nuevo indicador
router.post('/', async (req, res) => {
  try {
    const objetivo = await ObjetivoCalidad.findById(req.body.objetivoCalidadId);
    if (!objetivo) {
        return res.status(404).json({ message: 'El objetivo de calidad asociado no existe.' });
    }

    const nuevoIndicador = new IndicadorCalidad(req.body);
    const indicadorGuardado = await nuevoIndicador.save();
    res.status(201).json(indicadorGuardado);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Error de validación.', errors });
    }
    res.status(500).json({ message: 'Error al crear el indicador.', error: error.message });
  }
});

// PUT /api/indicadores-calidad/:id - Actualizar un indicador
router.put('/:id', validateMongoId, async (req, res) => {
  try {
    const indicadorActualizado = await IndicadorCalidad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!indicadorActualizado) {
      return res.status(404).json({ message: 'Indicador no encontrado.' });
    }
    res.json(indicadorActualizado);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Error de validación.', errors });
    }
    res.status(500).json({ message: 'Error al actualizar el indicador.', error: error.message });
  }
});

// DELETE /api/indicadores-calidad/:id - Eliminar un indicador
router.delete('/:id', validateMongoId, async (req, res) => {
  try {
    const indicadorEliminado = await IndicadorCalidad.findByIdAndDelete(req.params.id);
    if (!indicadorEliminado) {
      return res.status(404).json({ message: 'Indicador no encontrado.' });
    }
    res.json({ message: 'Indicador eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el indicador.', error: error.message });
  }
});

export default router;

