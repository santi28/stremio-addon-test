# Usa la imagen oficial de Bun
FROM oven/bun:1 AS base

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos necesarios para instalar dependencias
COPY package.json bun.lockb ./

# Instala dependencias en modo producción
RUN bun install --frozen-lockfile --production

# Copia el resto del código de la aplicación
COPY . .

# Cambiar al usuario Bun por seguridad
USER bun

# Expone el puerto utilizado por el servidor
EXPOSE 7800

# Comando para iniciar el servidor
CMD ["bun", "index.ts"]
