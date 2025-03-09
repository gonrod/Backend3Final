import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Backend 3",
            version: "1.0.0",
            description: "Documentación de la API para el proyecto Backend 3"
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Servidor de desarrollo"
            }
        ]
    },
    apis: ["./src/routes/*.js"] // Rutas a documentar
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

export default swaggerSpecs;
