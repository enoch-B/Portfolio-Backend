// config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio Backend API",
      version: "1.0.0",
      description: "API documentation for Portfolio Backend",
    },
    servers: [
      {
        url: "http://localhost:5001", // change when deploying
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], // paths to files with annotations
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
