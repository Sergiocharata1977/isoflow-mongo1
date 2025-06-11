import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Directorio donde se almacenan los documentos
const DOCUMENTS_DIR = path.join(process.cwd(), 'documents');

class RagService {
  constructor() {
    // Funcionalidad RAG DESACTIVADA
    console.warn("RAG Service CONSTRUCTOR: Funcionalidad RAG está DESACTIVADA. OpenAIEmbeddings y HNSWLib no se inicializarán.");
    this.embeddings = null; // No intentar inicializar OpenAIEmbeddings
    this.vectorStore = null;
    this.initialized = false;
  }

  // Inicializar el servicio: cargar y procesar documentos (DESACTIVADO)
  async initialize() {
    console.warn("RAG Service INITIALIZE: Funcionalidad RAG está DESACTIVADA. No se cargarán documentos ni se creará almacén de vectores.");
    this.initialized = false; // Asegurar que permanezca no inicializado
    return; 
  }

  // Consultar documentos relevantes basados en la consulta del usuario (DESACTIVADO)
  async queryDocuments(query, maxResults = 5) {
    console.warn("RAG Service QUERYDOCUMENTS: Funcionalidad RAG está DESACTIVADA. Devolviendo array vacío.");
    return [];
  }

  // Obtener un contexto formateado para enviar a la API de OpenAI (DESACTIVADO)
  async getDocumentContext(query) {
    console.warn("RAG Service GETDOCUMENTCONTEXT: Funcionalidad RAG está DESACTIVADA. Devolviendo null.");
    return null;
  }
}

// Exportar una instancia única del servicio
const ragService = new RagService();
export default ragService;
