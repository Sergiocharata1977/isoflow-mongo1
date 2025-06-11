import './loadEnv.js'; // Cargar variables de entorno primero
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './lib/mongoClient.js';

// Importación de todas las rutas

// import documentosRoutes from './routes/documentos.routes.js';
// import normasPuntosRoutes from './routes/normasPuntos.routes.js';
import procesosRoutes from './routes/procesos.routes.js';
// import objetivosCalidadRoutes from './routes/objetivosCalidad.routes.js';
// import indicadoresCalidadRoutes from './routes/indicadoresCalidad.routes.js';

// --- Configuración Inicial ---
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorio de subidas si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --- Conexión a la Base de Datos ---
connectDB();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// --- Rutas de la API ---
console.log('Registrando rutas de la API...');

// app.use('/api/documentos', documentosRoutes);
// app.use('/api/normas-puntos', normasPuntosRoutes);
app.use('/api/procesos', procesosRoutes);
// app.use('/api/objetivos-calidad', objetivosCalidadRoutes);
// app.use('/api/indicadores-calidad', indicadoresCalidadRoutes);
console.log('<<<<< Todas las rutas de la API han sido registradas correctamente >>>>>');

// --- Ruta de Prueba ---
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'El servidor de prueba está funcionando.' });
});

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

