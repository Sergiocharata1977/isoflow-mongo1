import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

// Nueva clave API
const NEW_API_KEY = 'TU_NUEVA_API_KEY_AQUI'; // Clave eliminada por seguridad

async function updateApiKey() {
  try {
    console.log('Actualizando clave API en el archivo .env...');
    
    // Verificar si el archivo .env existe
    if (!fs.existsSync(envPath)) {
      console.error('❌ El archivo .env no existe. Creándolo...');
      
      // Crear un nuevo archivo .env con la configuración básica
      const envContent = `PORT=3001
OPENAI_API_KEY=${NEW_API_KEY}
OPENAI_MODEL=gpt-4o`;
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Archivo .env creado con la nueva clave API.');
    } else {
      // El archivo .env existe, actualizar la clave API
      let envContent = fs.readFileSync(envPath, 'utf-8');
      
      // Verificar si contiene la variable OPENAI_API_KEY
      if (envContent.includes('OPENAI_API_KEY=')) {
        // Reemplazar la clave existente
        envContent = envContent.replace(/OPENAI_API_KEY=.*/g, `OPENAI_API_KEY=${NEW_API_KEY}`);
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Clave API actualizada en el archivo .env');
      } else {
        // Si no existe la variable, añadirla
        envContent += `\nOPENAI_API_KEY=${NEW_API_KEY}\n`;
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Variable OPENAI_API_KEY añadida al archivo .env');
      }
    }
    
    console.log('✅ Proceso completado. La nueva clave API ha sido configurada.');
    
  } catch (error) {
    console.error('❌ Error al actualizar la clave API:', error);
  }
}

updateApiKey();
