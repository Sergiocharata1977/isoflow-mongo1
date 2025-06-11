// Script para verificar los datos en la tabla personal
const { createClient } = require('@libsql/client');

// Crear cliente de Turso con las credenciales correctas
const client = createClient({
  url: "libsql://iso-muestra-104-sergiocharata1977.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDY3OTgzMTUsImlkIjoiYjM2Y2MxYzYtY2I0NC00NzFkLWEyYjYtNGI5MTI0NjQ2MmE4IiwicmlkIjoiZDIyMDRlMGQtMTcxYy00NjhkLTliODUtYzNhYTYzNDlhZmI0In0.6FSA-ozXSMWU5XtSgul4oNQ6nzhA42IyX9emolZusfrO4aGP6xvn0p7cHmBHRtpwlTSxX4Tq-UVWaX5QUtdzAw"
});

async function main() {
  try {
    console.log("Verificando datos en la tabla personal...");
    
    const result = await client.execute({
      sql: `SELECT * FROM personal`
    });
    
    console.log(`Encontrados ${result.rows.length} registros:`);
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
