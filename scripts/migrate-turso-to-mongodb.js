/**
 * Script de migración de TursoDB a MongoDB
 * Este script automáticamente reemplaza referencias a Turso por MongoDB en todo el proyecto
 */
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Directorios base
const projectRoot = path.resolve(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');
const srcDir = path.join(frontendDir, 'src');

// Lista de archivos principales a migrar (basado en el análisis)
const filesToProcess = [
  // Contexto y cliente principal
  path.join(srcDir, 'context', 'TursoContext.jsx'),
  path.join(srcDir, 'lib', 'tursoClient.js'),
  
  // Servicios
  path.join(srcDir, 'services', 'tursoService.js'),
  path.join(srcDir, 'services', 'tursoUsuarios.js'),
  path.join(srcDir, 'services', 'auth.js'),
  path.join(srcDir, 'services', 'auditoriasService.js'),
  path.join(srcDir, 'services', 'documentosService.js'),
  path.join(srcDir, 'services', 'eventosService.js'),
  path.join(srcDir, 'services', 'index.js'),
  
  // Componentes
  path.join(srcDir, 'components', 'usuarios', 'UsuariosListing.jsx'),
  path.join(srcDir, 'components', 'usuarios', 'UsuarioSingle.jsx'),
  path.join(srcDir, 'components', 'tickets', 'TicketsListing.jsx'),
  
  // Otros archivos importantes
  path.join(projectRoot, 'README.md')
];

// Reglas de reemplazo
const replacementRules = [
  // Importaciones
  { 
    pattern: /import\s*{\s*useTurso\s*}\s*from\s*['"](.*)\/TursoContext['"];?/g,
    replacement: `import { useMongo } from '$1/MongoContext';`
  },
  {
    pattern: /import\s*{\s*TursoProvider\s*}\s*from\s*['"](.*)\/TursoContext['"];?/g,
    replacement: `import { MongoProvider } from '$1/MongoContext';`
  },
  {
    pattern: /import\s*{\s*executeQuery\s*}\s*from\s*['"](.*)\/tursoClient['"];?/g,
    replacement: `// import { executeQuery } from '$1/tursoClient'; // Migrado a MongoDB`
  },
  {
    pattern: /import\s*tursoService\s*from\s*['"](.*)\/tursoService\.js['"];?/g,
    replacement: `// import tursoService from '$1/tursoService.js'; // Migrado a MongoDB`
  },
  
  // Uso de hooks y componentes
  {
    pattern: /const\s*{([^}]*)}\s*=\s*useTurso\(\);/g,
    replacement: `const {$1} = useMongo();`
  },
  {
    pattern: /<TursoProvider>/g,
    replacement: `<MongoProvider>`
  },
  {
    pattern: /<\/TursoProvider>/g,
    replacement: `</MongoProvider>`
  },
  
  // Referencias a cliente Turso
  {
    pattern: /const\s*{\s*executeQuery\s*}\s*=\s*await\s*import\(['"](.*)\/tursoClient\.js['"]\);/g,
    replacement: `// Migrado a MongoDB API`
  },
  {
    pattern: /await\s*executeQuery\(['"]SELECT\s*(.*)\s*FROM\s*(\w+)(.*)['"](,\s*\[([^\]]*)\])?\);/g,
    replacement: `await fetch('/api/$2').then(res => res.json()); // Consulta migrada a API MongoDB`
  },
  
  // Referencias a tursoClient
  {
    pattern: /tursoClient\.(execute|batch)\(/g,
    replacement: `mongoClient.db().collection // Migrado de tursoClient.$1(`
  },
  
  // Código SQL específico
  {
    pattern: /'SELECT\s*(.*)\s*FROM\s*(\w+)(.*)'/g,
    replacement: `// SQL migrado a MongoDB: 'SELECT $1 FROM $2$3'`
  },
  
  // Renombrar servicios en index.js
  {
    pattern: /tursoService,/g,
    replacement: `// tursoService, // Migrado a MongoDB`
  },
  {
    pattern: /turso: tursoService,/g,
    replacement: `// turso: tursoService, // Migrado a MongoDB`
  }
];

// Función principal
async function migrateToMongoDB() {
  console.log('🚀 Iniciando migración de TursoDB a MongoDB...');
  
  try {
    // 1. Verificar que todos los archivos existen
    await verifyFiles(filesToProcess);
    
    // 2. Crear archivos nuevos de MongoDB
    await createMongoFiles();
    
    // 3. Procesar cada archivo y aplicar reemplazos
    let processedCount = 0;
    
    for (const file of filesToProcess) {
      try {
        const fileModified = await processFile(file, replacementRules);
        if (fileModified) {
          processedCount++;
        }
      } catch (err) {
        console.error(`❌ Error al procesar ${file}:`, err.message);
      }
    }
    
    // 4. Buscar referencias a Turso en todo el proyecto y crear respaldo
    await createGlobalBackup();
    
    console.log(`✅ Migración completada. ${processedCount} archivos procesados.`);
    console.log('⚠️ IMPORTANTE: Revisa manualmente los archivos modificados.');
    console.log('🔍 Asegúrate de verificar que todas las funcionalidades sigan funcionando.');
  } catch (err) {
    console.error('❌ Error en la migración:', err.message);
  }
}

// Verificar que los archivos existen
async function verifyFiles(files) {
  console.log('🔍 Verificando archivos...');
  
  const missingFiles = [];
  
  for (const file of files) {
    try {
      await fs.access(file);
    } catch (err) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    console.warn(`⚠️ Algunos archivos no existen y serán omitidos:`);
    missingFiles.forEach(file => console.warn(`  - ${file}`));
  }
}

// Crear archivos nuevos de MongoDB
async function createMongoFiles() {
  console.log('📝 Creando archivos para MongoDB...');
  
  // Crear MongoContext.jsx si no existe
  const mongoContextPath = path.join(srcDir, 'context', 'MongoContext.jsx');
  
  try {
    await fs.access(mongoContextPath);
    console.log('✓ MongoContext.jsx ya existe');
  } catch (err) {
    // El archivo no existe, lo creamos
    const mongoContextContent = `import { createContext, useContext } from 'react';
import * as services from '../services';

// Contexto simple para reemplazar el anterior TursoContext
const MongoContext = createContext();

// Hook para usar el contexto
export const useMongo = () => useContext(MongoContext);

// Proveedor del contexto
export const MongoProvider = ({ children }) => {
  // Valor del contexto simplificado
  const value = {
    isLoading: false,
    error: null,
    dbConnected: true,
    services,
    // Servicios específicos
    personalService: services.personalService,
    auditoriasService: services.auditoriasService,
    documentosService: services.documentosService,
    // Manejador de peticiones generalizado
    handleRequest: async (requestFn) => {
      try {
        return await requestFn();
      } catch (error) {
        console.error('Error en la petición:', error);
        return { error: error.message || 'Error desconocido' };
      }
    },
    // Función para limpiar errores
    clearError: () => {}
  };

  return (
    <MongoContext.Provider value={value}>
      {children}
    </MongoContext.Provider>
  );
};

export default MongoContext;
`;
    
    await fs.writeFile(mongoContextPath, mongoContextContent, 'utf8');
    console.log(`✅ Creado: ${mongoContextPath}`);
  }
}

// Procesar un archivo y aplicar reglas de reemplazo
async function processFile(filePath, rules) {
  try {
    // Verificar si el archivo existe
    try {
      await fs.access(filePath);
    } catch (err) {
      console.warn(`⚠️ Archivo no encontrado, omitiendo: ${filePath}`);
      return false;
    }
    
    console.log(`🔄 Procesando: ${filePath}`);
    
    // Crear respaldo
    const backupPath = `${filePath}.turso-backup`;
    await fs.copyFile(filePath, backupPath);
    
    // Leer archivo
    let content = await fs.readFile(filePath, 'utf8');
    const originalContent = content;
    
    // Aplicar reglas de reemplazo
    for (const rule of rules) {
      content = content.replace(rule.pattern, rule.replacement);
    }
    
    // Si el contenido cambió, escribir de vuelta
    if (content !== originalContent) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ Modificado: ${filePath}`);
      return true;
    } else {
      // No hubo cambios
      await fs.unlink(backupPath); // Eliminar el respaldo si no hubo cambios
      console.log(`ℹ️ Sin cambios: ${filePath}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Error al procesar ${filePath}:`, err);
    return false;
  }
}

// Crear respaldo de todos los archivos que contienen referencias a Turso
async function createGlobalBackup() {
  console.log('📦 Creando respaldo global de archivos con referencias a Turso...');
  
  // Crear directorio de respaldo si no existe
  const backupDir = path.join(projectRoot, 'turso-backup-' + Date.now());
  await fs.mkdir(backupDir, { recursive: true });
  
  // Buscar todos los archivos con referencias a Turso
  try {
    const cmd = `cd "${projectRoot}" && git ls-files | xargs grep -l "turso" --include="*.js" --include="*.jsx" --include="*.md"`;
    const result = execSync(cmd, { encoding: 'utf8' });
    
    const files = result.trim().split('\n');
    
    // Copiar cada archivo al directorio de respaldo
    for (const file of files) {
      if (!file) continue;
      
      const sourcePath = path.join(projectRoot, file);
      const destPath = path.join(backupDir, file);
      
      // Crear directorios necesarios
      const destDir = path.dirname(destPath);
      await fs.mkdir(destDir, { recursive: true });
      
      // Copiar archivo
      await fs.copyFile(sourcePath, destPath);
    }
    
    console.log(`✅ Respaldo global creado en: ${backupDir}`);
  } catch (err) {
    console.error('❌ Error al crear respaldo global:', err);
  }
}

// Ejecutar la migración
migrateToMongoDB();
