import './loadEnv.js'; // LOAD ENV VARS FIRST

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// import ragService from './services/ragService.js'; // RAG Service temporalmente desactivado
// AI Services removed: documentAnalyzerService, assistantInitializer, isoAssistantService
import { connectDB } from './lib/mongoClient.js'; // Added for MongoDB
import departamentosRouter from './routes/departamentos.routes.js';
import puestosRouter from './routes/puestos.routes.js';
import personalRouter from './routes/personal.routes.js';
import documentosRouter from './routes/documentos.routes.js';
import normasPuntosRouter from './routes/normasPuntos.routes.js';
import procesosRouter from './routes/procesos.routes.js';
import objetivosCalidadRouter from './routes/objetivos-calidad.routes.js';

// Crear directorio temporal para archivos si no existe
const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configurar multer para la carga de archivos
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
});

const app = express();
// Temporalmente forzamos el puerto a 3002 para pruebas, ignorando variables de entorno
const PORT = 3002;

// Middleware
app.use(cors()); // Permite solicitudes de diferentes orígenes (tu frontend)
app.use(express.json()); // Permite al servidor entender JSON en las solicitudes

// Rutas para RRHH
app.use('/api/departamentos', departamentosRouter);
app.use('/api/puestos', puestosRouter);
app.use('/api/personal', personalRouter);
console.log('<<<<< RUTA /api/personal REGISTRADA >>>>>');
app.use('/api/documentos', documentosRouter);
console.log('<<<<< RUTA /api/documentos REGISTRADA >>>>>');
app.use('/api/normas-puntos', normasPuntosRouter);
console.log('<<<<< RUTA /api/normas-puntos REGISTRADA >>>>>');
app.use('/api/procesos', procesosRouter);
console.log('<<<<< RUTA /api/procesos REGISTRADA >>>>>');
app.use('/api/objetivos-calidad', objetivosCalidadRouter);
console.log('<<<<< RUTA /api/objetivos-calidad REGISTRADA >>>>>');

// RUTA DE PRUEBA DIRECTA
app.get('/api/testpersonal', (req, res) => {
  console.log('<<<<< ACCEDIENDO A RUTA GET /api/testpersonal (DIRECTA EN INDEX.JS) >>>>>');
  res.status(200).json({ message: 'Ruta /api/testpersonal en index.js alcanzada' });
});

// Iniciar el servidor
app.listen(PORT, async () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
  
  try {
    // Conectar a MongoDB
    await connectDB(); // Added for MongoDB
    // console.log('MongoDB connection established.'); // Optional: confirmation message

    // OpenAI assistant initialization removed.
  } catch (error) {
    // This will catch errors from connectDB() or assistantInitializer
    console.error('❌ Error crítico durante la inicialización del servidor:', error);
    process.exit(1); // Exit if critical initialization fails
  }
});
