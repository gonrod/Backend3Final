#definir tipo de app
FROM node

#definir directorio de trabajo
WORKDIR /build

#copiar archivos
COPY package*.json ./

#instalar dependencias
RUN npm install

#copiar archivos
COPY . .

#exponer puerto
EXPOSE 8080

# Iniciar app
CMD ["npm", "start"]