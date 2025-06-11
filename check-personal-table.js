// Script para verificar la tabla de personal en Turso
const { createClient } = require('@libsql/client');

// Crear cliente de Turso con las credenciales correctas
const client = createClient({
  url: "libsql://iso-muestra-104-sergiocharata1977.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDY3OTgzMTUsImlkIjoiYjM2Y2MxYzYtY2I0NC00NzFkLWEyYjYtNGI5MTI0NjQ2MmE4IiwicmlkIjoiZDIyMDRlMGQtMTcxYy00NjhkLTliODUtYzNhYTYzNDlhZmI0In0.6FSA-ozXSMWU5XtSgul4oNQ6nzhA42IyX9emolZusfrO4aGP6xvn0p7cHmBHRtpwlTSxX4Tq-UVWaX5QUtdzAw"
});

async function main() {
  try {
    // 1. Verificar si la tabla personal existe
    console.log("Verificando si la tabla personal existe...");
    let result = await client.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name='personal'`
    });

    const tableExists = result.rows.length > 0;
    console.log(`¿La tabla personal existe? ${tableExists ? 'SÍ' : 'NO'}`);

    if (tableExists) {
      // 2. Obtener información del esquema de la tabla
      console.log("\nEstructura de la tabla personal:");
      result = await client.execute({
        sql: `PRAGMA table_info(personal)`
      });
      console.table(result.rows);

      // 3. Contar registros en la tabla
      result = await client.execute({
        sql: `SELECT COUNT(*) as count FROM personal`
      });
      console.log(`\nLa tabla personal contiene ${result.rows[0].count} registros.`);

      // 4. Mostrar los primeros registros si existen
      if (result.rows[0].count > 0) {
        result = await client.execute({
          sql: `SELECT * FROM personal LIMIT 2`
        });
        console.log("\nPrimeros registros en la tabla personal:");
        console.log(JSON.stringify(result.rows, null, 2));
      }
    } else {
      // Crear la tabla si no existe
      console.log("\nCreando la tabla personal...");
      await client.execute({
        sql: `CREATE TABLE personal (
          id TEXT PRIMARY KEY,
          numero TEXT,
          nombre TEXT NOT NULL,
          puesto TEXT,
          departamento TEXT,
          email TEXT,
          telefono TEXT,
          fecha_ingreso TEXT,
          documento_identidad TEXT,
          direccion TEXT,
          formacion_academica TEXT,
          experiencia_laboral TEXT,
          competencias TEXT,
          evaluacion_desempeno TEXT,
          capacitaciones_recibidas TEXT,
          observaciones TEXT,
          imagen TEXT,
          created_at TEXT,
          updated_at TEXT
        )`
      });
      console.log("¡Tabla personal creada exitosamente!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
