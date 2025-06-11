# IsoFlow3 - Sistema de Gestión de Procesos ISO
**Código de Proyecto:** ISOFLOW3-MONGO-2024

## Descripción General
IsoFlow3 es una aplicación web moderna que implementa una arquitectura cliente-servidor, diseñada para la gestión de procesos ISO. El proyecto está estructurado de manera modular y sigue las mejores prácticas de desarrollo.

## Estado Actual del Proyecto
**Última Actualización:** Marzo 2024
**Versión:** 3.0.0
**Base de Datos:** MongoDB (Migración desde TursoDB)

### Cambios Recientes
1. **Migración a MongoDB**
   - Completada la migración desde TursoDB a MongoDB
   - Implementados nuevos scripts de inicialización
   - Actualizada la estructura de datos para documentos MongoDB

2. **Servicios Actualizados**
   - `eventosService.js`: Migrado a MongoDB
   - `tursoUsuarios.js`: Migrado a MongoDB
   - `auth.js`: Migrado a MongoDB

3. **Componentes Actualizados**
   - `UsuariosListing.jsx`: Adaptado para MongoDB
   - `TicketsListing.jsx`: Adaptado para MongoDB

4. **Nuevos Scripts de Base de Datos**
   - `create-auth-collections.js`: Inicialización de colecciones MongoDB
   - `add-sample-users.js`: Generación de usuarios de muestra
   - `add-sample-procesos.js`: Generación de procesos de muestra

## Configuración del Proyecto

### Requisitos Previos
- Node.js >= 18.x
- MongoDB >= 6.0
- npm o yarn

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto con:
```
MONGODB_URI=mongodb://localhost:27017/isoflow3
JWT_SECRET=tu_secreto_jwt
```

### Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/isoflow3-mongo.git
cd isoflow3-mongo
```

2. Instalar dependencias:
```bash
npm install
```

3. Inicializar la base de datos:
```bash
node scripts/create-auth-collections.js
node scripts/add-sample-users.js
node scripts/add-sample-procesos.js
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── usuarios/
│   │   │   └── UsuariosListing.jsx
│   │   └── tickets/
│   │       └── TicketsListing.jsx
│   └── services/
│       ├── eventosService.js
│       ├── tursoUsuarios.js
│       └── auth.js
```

### Backend
```
backend/
├── scripts/
│   ├── create-auth-collections.js
│   ├── add-sample-users.js
│   └── add-sample-procesos.js
└── services/
    └── mongodb.js
```

## Mantenimiento y Desarrollo

### Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run test`: Ejecuta las pruebas
- `npm run lint`: Ejecuta el linter

### Scripts de Base de Datos
- `node scripts/create-auth-collections.js`: Crea las colecciones necesarias
- `node scripts/add-sample-users.js`: Agrega usuarios de muestra
- `node scripts/add-sample-procesos.js`: Agrega procesos de muestra

## Contacto y Soporte
Para reportar problemas o solicitar soporte, por favor crear un issue en el repositorio de GitHub con el código de proyecto: `ISOFLOW3-MONGO-2024`

## Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.