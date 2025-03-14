# Usar una imagen base más ligera
FROM node:slim

# Definir directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios antes de instalar dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --prod

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto
EXPOSE 8080

# Comando de inicio
CMD ["npm", "start"]