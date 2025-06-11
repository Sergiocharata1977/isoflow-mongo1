// Script para crear registros de ejemplo en la tabla personal usando las imágenes subidas
const { createClient } = require('@libsql/client');

// Crear cliente de Turso con las credenciales correctas
const client = createClient({
  url: "libsql://iso-muestra-104-sergiocharata1977.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDY3OTgzMTUsImlkIjoiYjM2Y2MxYzYtY2I0NC00NzFkLWEyYjYtNGI5MTI0NjQ2MmE4IiwicmlkIjoiZDIyMDRlMGQtMTcxYy00NjhkLTliODUtYzNhYTYzNDlhZmI0In0.6FSA-ozXSMWU5XtSgul4oNQ6nzhA42IyX9emolZusfrO4aGP6xvn0p7cHmBHRtpwlTSxX4Tq-UVWaX5QUtdzAw"
});

// Lista de imágenes disponibles
const imagenes = [
  "/images/personal/descarga (40).jfif",
  "/images/personal/descarga (41).jfif",
  "/images/personal/descarga (42).jfif",
  "/images/personal/image (1).jfif",
  "/images/personal/image (2).jfif",
  "/images/personal/image (2).png",
  "/images/personal/image (3).jfif",
  "/images/personal/image (4).png",
  "/images/personal/image.jfif",
  "/images/personal/v3_0277343.jpg",
  "/images/personal/v3_0681825.jpg",
  "/images/personal/v3_0700969.jpg",
  "/images/personal/v3_0723349.jpg",
  "/images/personal/v3_0929466 (1).jpg"
];

// Datos de ejemplo para personal
const personalEjemplo = [
  {
    numero: "P202505-001",
    nombre: "María Rodríguez",
    puesto: "Gerente de Calidad",
    departamento: "Calidad",
    email: "maria.rodriguez@empresa.com",
    telefono: "123-456-7890",
    fecha_ingreso: "2022-03-15",
    documento_identidad: "33452789",
    direccion: "Av. Libertador 1234, Buenos Aires",
    formacion_academica: JSON.stringify([
      {
        titulo: "Ingeniería Industrial",
        institucion: "Universidad de Buenos Aires",
        anioFinalizacion: "2010",
        descripcion: "Especialización en gestión de calidad"
      }
    ]),
    experiencia_laboral: JSON.stringify([
      {
        empresa: "Industrias ABC",
        puesto: "Coordinadora de Calidad",
        fechaInicio: "2010-06-01",
        fechaFin: "2022-02-28",
        descripcion: "Implementación de estándares ISO 9001"
      }
    ]),
    competencias: "Liderazgo, comunicación efectiva, gestión de proyectos, ISO 9001, ISO 14001",
    evaluacion_desempeno: "Sobresaliente",
    capacitaciones_recibidas: "Auditor Líder ISO 9001, Gestión de Equipos de Alto Rendimiento",
    observaciones: "Certificada como Lead Auditor ISO 9001:2015",
    imagen: imagenes[0]
  },
  {
    numero: "P202505-002",
    nombre: "Carlos Méndez",
    puesto: "Especialista en HSE",
    departamento: "Seguridad",
    email: "carlos.mendez@empresa.com",
    telefono: "123-456-7891",
    fecha_ingreso: "2023-01-10",
    documento_identidad: "28945612",
    direccion: "Calle Corrientes 567, Buenos Aires",
    formacion_academica: JSON.stringify([
      {
        titulo: "Ingeniería en Seguridad e Higiene",
        institucion: "Universidad Tecnológica Nacional",
        anioFinalizacion: "2014",
        descripcion: "Enfoque en seguridad industrial"
      }
    ]),
    experiencia_laboral: JSON.stringify([
      {
        empresa: "Petroquímica XYZ",
        puesto: "Responsable de Seguridad",
        fechaInicio: "2014-08-01",
        fechaFin: "2022-12-31",
        descripcion: "Gestión de programas de seguridad y salud ocupacional"
      }
    ]),
    competencias: "Análisis de riesgos, investigación de incidentes, ISO 45001, legislación de seguridad",
    evaluacion_desempeno: "Muy bueno",
    capacitaciones_recibidas: "Auditor ISO 45001, Prevención de Riesgos Laborales",
    observaciones: "Experiencia en industrias de alto riesgo",
    imagen: imagenes[1]
  },
  {
    numero: "P202505-003",
    nombre: "Ana González",
    puesto: "Analista de Procesos",
    departamento: "Calidad",
    email: "ana.gonzalez@empresa.com",
    telefono: "123-456-7892",
    fecha_ingreso: "2021-06-15",
    documento_identidad: "32156789",
    direccion: "Av. 9 de Julio 890, Buenos Aires",
    formacion_academica: JSON.stringify([
      {
        titulo: "Ingeniería de Procesos",
        institucion: "Universidad de La Plata",
        anioFinalizacion: "2018",
        descripcion: "Especialización en mejora continua"
      }
    ]),
    experiencia_laboral: JSON.stringify([
      {
        empresa: "Consultora Lean",
        puesto: "Analista Junior",
        fechaInicio: "2018-03-01",
        fechaFin: "2021-05-30",
        descripcion: "Consultoría en mejora de procesos y reducción de desperdicios"
      }
    ]),
    competencias: "Lean Manufacturing, Six Sigma, análisis de datos, mapeo de procesos",
    evaluacion_desempeno: "Excelente",
    capacitaciones_recibidas: "Green Belt Six Sigma, Kaizen",
    observaciones: "En proceso de certificación Black Belt",
    imagen: imagenes[2]
  },
  {
    numero: "P202505-004",
    nombre: "Roberto Silva",
    puesto: "Auditor Interno",
    departamento: "Auditoría",
    email: "roberto.silva@empresa.com",
    telefono: "123-456-7893",
    fecha_ingreso: "2022-09-01",
    documento_identidad: "25789456",
    direccion: "Calle Florida 234, Buenos Aires",
    formacion_academica: JSON.stringify([
      {
        titulo: "Contador Público",
        institucion: "Universidad de San Andrés",
        anioFinalizacion: "2012",
        descripcion: "Especialización en auditoría"
      }
    ]),
    experiencia_laboral: JSON.stringify([
      {
        empresa: "Big Four Consulting",
        puesto: "Auditor Senior",
        fechaInicio: "2012-05-01",
        fechaFin: "2022-08-15",
        descripcion: "Auditorías internas y externas de sistemas de gestión"
      }
    ]),
    competencias: "Auditoría interna, ISO 19011, gestión de riesgos, normativa ISO",
    evaluacion_desempeno: "Muy bueno",
    capacitaciones_recibidas: "Formación de Auditores Internos, Gestión del Riesgo",
    observaciones: "Experiencia en múltiples normas ISO",
    imagen: imagenes[3]
  },
  {
    numero: "P202505-005",
    nombre: "Laura Martínez",
    puesto: "Responsable de Medio Ambiente",
    departamento: "Medio Ambiente",
    email: "laura.martinez@empresa.com",
    telefono: "123-456-7894",
    fecha_ingreso: "2020-02-15",
    documento_identidad: "30123456",
    direccion: "Av. Santa Fe 789, Buenos Aires",
    formacion_academica: JSON.stringify([
      {
        titulo: "Ingeniería Ambiental",
        institucion: "Universidad Nacional de Córdoba",
        anioFinalizacion: "2015",
        descripcion: "Enfoque en gestión ambiental industrial"
      }
    ]),
    experiencia_laboral: JSON.stringify([
      {
        empresa: "EcoConsultores",
        puesto: "Consultora Ambiental",
        fechaInicio: "2015-04-01",
        fechaFin: "2020-01-31",
        descripcion: "Estudios de impacto ambiental y planes de gestión"
      }
    ]),
    competencias: "ISO 14001, legislación ambiental, gestión de residuos, evaluación de impacto",
    evaluacion_desempeno: "Excelente",
    capacitaciones_recibidas: "Auditor ISO 14001, Economía Circular",
    observaciones: "Especialista en gestión de residuos peligrosos",
    imagen: imagenes[4]
  },
  {
    numero: "P202505-006",
    nombre: "Diego Fernández",
    puesto: "Supervisor de Producción",
    departamento: "Producción",
    email: "diego.fernandez@empresa.com",
    telefono: "123-456-7895",
    fecha_ingreso: "2023-04-03",
    documento_identidad: "27456123",
    direccion: "Calle Rivadavia 567, Buenos Aires",
    formacion_academica: JSON.stringify([
      {
        titulo: "Ingeniería Mecánica",
        institucion: "Universidad Tecnológica Nacional",
        anioFinalizacion: "2016",
        descripcion: "Especialización en procesos productivos"
      }
    ]),
    experiencia_laboral: JSON.stringify([
      {
        empresa: "Industrias Metálicas SA",
        puesto: "Jefe de Línea",
        fechaInicio: "2016-07-01",
        fechaFin: "2023-03-15",
        descripcion: "Supervisión de líneas de producción y mejora de eficiencia"
      }
    ]),
    competencias: "Gestión de producción, mantenimiento preventivo, TPM, SMED",
    evaluacion_desempeno: "Bueno",
    capacitaciones_recibidas: "Mantenimiento Productivo Total, Lean Manufacturing",
    observaciones: "Experiencia en gestión de equipos numerosos",
    imagen: imagenes[5]
  },
  {
    numero: "P202505-007",
    nombre: "Lucía Ramírez",
    puesto: "Analista de Laboratorio",
    departamento: "Calidad",
    email: "lucia.ramirez@empresa.com",
    telefono: "123-456-7896",
    fecha_ingreso: "2019-11-04",
    documento_identidad: "31456789",
    direccion: "Calle Callao 123, Buenos Aires",
    formacion_academica: JSON.stringify([
      {
        titulo: "Bioquímica",
        institucion: "Universidad de Buenos Aires",
        anioFinalizacion: "2017",
        descripcion: "Especialización en análisis industrial"
      }
    ]),
    experiencia_laboral: JSON.stringify([
      {
        empresa: "Laboratorio de Calidad S.A.",
        puesto: "Analista",
        fechaInicio: "2017-06-15",
        fechaFin: "2019-10-30",
        descripcion: "Análisis de muestras y control de calidad"
      }
    ]),
    competencias: "Análisis químico, pruebas de laboratorio, ISO 17025, calibración de equipos",
    evaluacion_desempeno: "Muy bueno",
    capacitaciones_recibidas: "BPL (Buenas Prácticas de Laboratorio), Control Estadístico de Procesos",
    observaciones: "Experiencia en validación de métodos analíticos",
    imagen: imagenes[6]
  }
];

async function main() {
  try {
    console.log("Creando registros de ejemplo en la tabla personal...");
    
    // Limpiar registros existentes (opcional - comentar si no quieres borrar datos existentes)
    await client.execute({
      sql: `DELETE FROM personal`
    });
    
    // Insertar los nuevos registros
    for (const persona of personalEjemplo) {
      const fecha = new Date().toISOString();
      
      await client.execute({
        sql: `INSERT INTO personal (
          numero, nombre, puesto, departamento, email, telefono, 
          fecha_ingreso, documento_identidad, direccion, 
          formacion_academica, experiencia_laboral, competencias, 
          evaluacion_desempeno, capacitaciones_recibidas, observaciones, 
          imagen, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          persona.numero,
          persona.nombre,
          persona.puesto,
          persona.departamento,
          persona.email,
          persona.telefono,
          persona.fecha_ingreso,
          persona.documento_identidad,
          persona.direccion,
          persona.formacion_academica,
          persona.experiencia_laboral,
          persona.competencias,
          persona.evaluacion_desempeno,
          persona.capacitaciones_recibidas,
          persona.observaciones,
          persona.imagen,
          fecha,
          fecha
        ]
      });
      
      console.log(`Registro creado para ${persona.nombre}`);
    }
    
    // Verificar la cantidad de registros insertados
    const countResult = await client.execute({
      sql: `SELECT COUNT(*) as count FROM personal`
    });
    console.log(`Se crearon ${countResult.rows[0].count} registros de personal.`);
    
    console.log("¡Creación de registros de ejemplo completada con éxito!");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
