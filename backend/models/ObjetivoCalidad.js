import mongoose from 'mongoose';

const objetivoCalidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del objetivo es obligatorio.'],
    trim: true,
    maxlength: [150, 'El nombre del objetivo no puede exceder los 150 caracteres.']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder los 500 caracteres.']
  },
  procesoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proceso', // Asumiendo que tienes un modelo llamado 'Proceso'
    required: [true, 'El proceso asociado es obligatorio.']
  },
  responsable: {
    type: String,
    required: [true, 'El responsable es obligatorio.'],
    trim: true
  },
  fechaInicio: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria.']
  },
  fechaFin: {
    type: Date,
    required: [true, 'La fecha de fin es obligatoria.']
  },
  estado: {
    type: String,
    required: [true, 'El estado es obligatorio.'],
    enum: ['Activo', 'Cumplido', 'No alcanzado', 'En revisión', 'Cancelado'],
    default: 'Activo'
  },
  accionesPlaneadas: {
    type: String,
    maxlength: [1000, 'Las acciones planeadas no pueden exceder los 1000 caracteres.']
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaUltimaModificacion: {
    type: Date,
    default: Date.now
  }
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaUltimaModificacion' } });

// Middleware para actualizar fechaUltimaModificacion antes de guardar
objetivoCalidadSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.fechaUltimaModificacion = Date.now();
  }
  next();
});

// Middleware para actualizar fechaUltimaModificacion en updates
objetivoCalidadSchema.pre('findOneAndUpdate', function(next) {
  this.set({ fechaUltimaModificacion: Date.now() });
  next();
});


const ObjetivoCalidad = mongoose.model('ObjetivoCalidad', objetivoCalidadSchema, 'objetivoscalidad');

export default ObjetivoCalidad;
