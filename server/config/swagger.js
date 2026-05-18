import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Desserts API',
      version: '1.0.0',
      description: 'API REST para gestión de productos — PERN Stack',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'category', 'price'],
          properties: {
            name:            { type: 'string',  example: 'Waffle with Berries' },
            category:        { type: 'string',  example: 'Waffle' },
            price:           { type: 'number',  example: 6.50 },
            image_thumbnail: { type: 'string' },
            image_mobile:    { type: 'string' },
            image_tablet:    { type: 'string' },
            image_desktop:   { type: 'string' },
          },
        },
      },
    },
    tags: [{ name: 'Products', description: 'CRUD de productos' }],
  },
  apis: ['./routes/*.routes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);