import OpenAI from 'openai';
import 'dotenv/config';

async function testOpenAI() {
  try {
    console.log('Verificando la clave API de OpenAI...');
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('⚠️ Error: No se encontró la variable OPENAI_API_KEY en el archivo .env');
      return;
    }
    
    // Mostrar los primeros y últimos 4 caracteres de la API key para verificación (sin exponer toda la clave)
    const apiKey = process.env.OPENAI_API_KEY;
    const maskedKey = apiKey.substring(0, 7) + '...' + apiKey.substring(apiKey.length - 4);
    console.log(`📝 Usando clave API: ${maskedKey}`);
    console.log(`📝 Modelo configurado: ${process.env.OPENAI_MODEL || 'No especificado'}`);
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    console.log('🔄 Enviando una solicitud de prueba a la API de OpenAI...');
    
    // Primero intentamos con el modelo configurado, si falla probamos con gpt-3.5-turbo
    let modelToUse = process.env.OPENAI_MODEL || 'gpt-4o';
    console.log(`🔄 Probando con el modelo: ${modelToUse}`);
    
    try {
      const response = await openai.chat.completions.create({
        model: modelToUse,
        messages: [{ role: 'user', content: 'Responde con "OK" si esta solicitud funciona correctamente.' }],
        max_tokens: 10
      });
      
      console.log('✅ Respuesta recibida de OpenAI:');
      console.log(response.choices[0].message);
      console.log('✅ La clave API de OpenAI funciona correctamente.');
    } catch (modelError) {
      console.error(`❌ Error con el modelo ${modelToUse}:`);
      console.error(modelError.message);
      console.log('🔄 Probando con el modelo de respaldo: gpt-3.5-turbo');
      
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Responde con "OK" si esta solicitud funciona correctamente.' }],
          max_tokens: 10
        });
        
        console.log('✅ Respuesta recibida de OpenAI con el modelo de respaldo:');
        console.log(response.choices[0].message);
        console.log('✅ La clave API de OpenAI funciona correctamente, pero con el modelo de respaldo.');
      } catch (fallbackError) {
        throw fallbackError; // Propagar el error para el catch externo
      }
    }
    
  } catch (error) {
    console.error('❌ Error al conectar con la API de OpenAI:');
    console.error(error.message);
    
    if (error.message.includes('401')) {
      console.error('⚠️ Error de autenticación: Tu clave API podría ser inválida o estar vencida.');
    } else if (error.message.includes('429')) {
      console.error('⚠️ Error de límite: Has alcanzado el límite de solicitudes o tu cuenta no tiene crédito suficiente.');
    } else if (error.message.includes('insufficient_quota')) {
      console.error('⚠️ Cuota insuficiente: Tu cuenta no tiene crédito disponible para realizar solicitudes.');
    }
  }
}

testOpenAI();
