const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const indicadorCalidadSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del indicador es obligatorio.'],
    trim: true,
    maxlength: [150, 'El nombre no puede tener más de 150 caracteres.']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres.']
  },
  objetivoCalidadId: {
    type: Schema.Types.ObjectId,
    ref: 'ObjetivoCalidad',
    required: [true, 'El indicador debe estar asociado a un objetivo de calidad.']
  },
  unidadMedida: {
    type: String,
    required: [true, 'La unidad de medida es obligatoria.'],
    trim: true
  },
  meta: {
    type: Number,
    required: [true, 'La meta es obligatoria.']
  },
  limiteInferior: {
    type: Number
  },
  limiteSuperior: {
    type: Number
  },
  frecuenciaMedicion: {
    type: String,
    enum: ['Diaria', 'Semanal', 'Quincenal', 'Mensual', 'Bimestral', 'Trimestral', 'Anual'],
    default: 'Mensual'
  },
  responsable: {
    type: String,
    required: [true, 'El responsable es obligatorio.'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['Activo', 'Inactivo', 'Suspendido'],
    default: 'Activo'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaUltimaModificacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaUltimaModificacion'
  },
  collection: 'indicadorescalidad'
});

// Middleware para actualizar la fecha de última modificación antes de guardar
indicadorCalidadSchema.pre('save', function(next) {
  this.fechaUltimaModificacion = new Date();
  next();
});

indicadorCalidadSchema.pre('findOneAndUpdate', function(next) {
  this.set({ fechaUltimaModificacion: new Date() });
  next();
});

const IndicadorCalidad = mongoose.model('IndicadorCalidad', indicadorCalidadSchema);

module.exports = IndicadorCalidad;
