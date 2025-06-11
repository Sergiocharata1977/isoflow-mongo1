# Etapa de dependencias
FROM node:18-alpine AS deps
WORKDIR /usr/src/app

# Copiar solo los package.json para cachear las dependencias
COPY package.json package-lock.json*
RUN npm ci

# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# En un proyecto real, aquí podrías tener un paso de build (ej. para TypeScript)
# RUN npm run build

# Etapa final de producción
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Copiar las variables de entorno por defecto
COPY .env.example .env

# Copiar dependencias de producción
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copiar el código de la aplicación
COPY --from=builder /usr/src/app/index.js ./
COPY --from=builder /usr/src/app/lib ./lib
COPY --from=builder /usr/src/app/loadEnv.js ./
COPY --from=builder /usr/src/app/models ./models
COPY --from=builder /usr/src/app/routes ./routes
COPY --from=builder /usr/src/app/services ./services

EXPOSE 3001

CMD ["node", "index.js"]
