import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Glucose Metric Calculator API',
        version: '1.0.0',
        description: 'API for calculating glucose metrics per member',
      },
      servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./src/routes/*.ts'],
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};