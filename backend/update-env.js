import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Obtener el directorio actual
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

async function updateEnvFile() {
  try {
    console.log('Actualizando archivo .env...');
    
    // Verificar si el archivo .env existe
    if (!fs.existsSync(envPath)) {
      console.error('❌ El archivo .env no existe. Creándolo desde .env.example...');
      
      // Intentar copiar desde .env.example
      const envExamplePath = path.join(__dirname, '.env.example');
      if (fs.existsSync(envExamplePath)) {
        let envContent = fs.readFileSync(envExamplePath, 'utf-8');
        
        // Reemplazar gpt-4-turbo por gpt-4o
        envContent = envContent.replace('OPENAI_MODEL=gpt-4-turbo', 'OPENAI_MODEL=gpt-4o');
        
        // Escribir el archivo .env actualizado
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Archivo .env creado con éxito.');
      } else {
        console.error('❌ No se encontró el archivo .env.example.');
        return;
      }
    } else {
      // El archivo .env existe, actualizar el modelo
      let envContent = fs.readFileSync(envPath, 'utf-8');
      
      // Verificar si contiene la variable OPENAI_MODEL
      if (envContent.includes('OPENAI_MODEL=gpt-4-turbo')) {
        envContent = envContent.replace('OPENAI_MODEL=gpt-4-turbo', 'OPENAI_MODEL=gpt-4o');
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Modelo actualizado a gpt-4o en el archivo .env');
      } else if (!envContent.includes('OPENAI_MODEL=')) {
        // Si no existe la variable, añadirla
        envContent += '\nOPENAI_MODEL=gpt-4o\n';
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Variable OPENAI_MODEL=gpt-4o añadida al archivo .env');
      } else if (envContent.includes('OPENAI_MODEL=gpt-4o')) {
        console.log('✅ El modelo ya está actualizado a gpt-4o en el archivo .env');
      } else {
        // Hay otro valor, actualizarlo
        const regex = /OPENAI_MODEL=(.*)/;
        envContent = envContent.replace(regex, 'OPENAI_MODEL=gpt-4o');
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Modelo actualizado a gpt-4o en el archivo .env');
      }
    }
    
    console.log('🔄 Verificando si la clave API está configurada...');
    if (!process.env.OPENAI_API_KEY) {
      console.error('⚠️ No se encontró la variable OPENAI_API_KEY en el entorno.');
      console.error('Por favor, asegúrate de que está correctamente configurada en el archivo .env');
    } else {
      console.log('✅ La variable OPENAI_API_KEY está configurada.');
    }
    
  } catch (error) {
    console.error('❌ Error al actualizar el archivo .env:', error);
  }
}

updateEnvFile();
