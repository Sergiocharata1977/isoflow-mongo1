// Script para actualizar la tabla de personal en Turso
const { createClient } = require('@libsql/client');

// Crear cliente de Turso con las credenciales correctas
const client = createClient({
  url: "libsql://iso-muestra-104-sergiocharata1977.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDY3OTgzMTUsImlkIjoiYjM2Y2MxYzYtY2I0NC00NzFkLWEyYjYtNGI5MTI0NjQ2MmE4IiwicmlkIjoiZDIyMDRlMGQtMTcxYy00NjhkLTliODUtYzNhYTYzNDlhZmI0In0.6FSA-ozXSMWU5XtSgul4oNQ6nzhA42IyX9emolZusfrO4aGP6xvn0p7cHmBHRtpwlTSxX4Tq-UVWaX5QUtdzAw"
});

async function main() {
  try {
    // 1. Verificar si la tabla personal existe
    console.log("Actualizando la tabla personal...");
    
    // Primero renombramos la tabla actual (si hay datos los preservaremos)
    await client.execute({
      sql: `ALTER TABLE personal RENAME TO personal_old`
    });
    console.log("Tabla personal actual renombrada a personal_old");
    
    // Crear la nueva tabla con todos los campos necesarios
    await client.execute({
      sql: `CREATE TABLE personal (
        id INTEGER PRIMARY KEY,
        numero TEXT,
        nombre TEXT NOT NULL,
        puesto TEXT,
        departamento TEXT,
        email TEXT,
        telefono TEXT,
        fecha_ingreso TEXT,  -- Cambiado de fecha_contratacion
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
    console.log("Nueva tabla personal creada con todos los campos necesarios");
    
    // Transferir datos de la tabla antigua a la nueva
    await client.execute({
      sql: `INSERT INTO personal (id, nombre, puesto, departamento, email, telefono, fecha_ingreso, imagen)
            SELECT id, nombre, puesto, departamento, email, telefono, fecha_contratacion, imagen 
            FROM personal_old`
    });
    console.log("Datos transferidos de la tabla antigua a la nueva");

    // Verificar la transferencia
    const countResult = await client.execute({
      sql: `SELECT COUNT(*) as count FROM personal`
    });
    console.log(`La nueva tabla personal contiene ${countResult.rows[0].count} registros`);

    // Opcional: Eliminar la tabla antigua
    // await client.execute({
    //  sql: `DROP TABLE personal_old`
    // });
    // console.log("Tabla antigua eliminada");

    console.log("¡Actualización de la tabla personal completada con éxito!");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
