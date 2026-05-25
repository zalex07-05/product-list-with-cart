import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Desserts API',
            version: '1.0.0',
            description: 'API REST para gestión de productos, pedidos y pagos — PERN Stack',
        },
        servers: [{url: 'http://localhost:3000'}],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Product: {
                    type: 'object',
                    required: ['name', 'category', 'price'],
                    properties: {
                        name: {type: 'string', example: 'Waffle with Berries'},
                        category: {type: 'string', example: 'Waffle'},
                        price: {type: 'number', example: 6.50},
                        image_thumbnail: {type: 'string'},
                        image_mobile: {type: 'string'},
                        image_tablet: {type: 'string'},
                        image_desktop: {type: 'string'},
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        id: {type: 'integer'},
                        user_id: {type: 'integer'},
                        user_name: {type: 'string'},
                        user_email: {type: 'string'},
                        total_price: {type: 'number'},
                        payment_status: {type: 'string', enum: ['pending', 'paid', 'cancelled', 'rejected', 'expired']},
                        order_status: {type: 'string'},
                        payment_method: {type: 'string'},
                        delivery_address: {type: 'string'},
                        created_at: {type: 'string', format: 'date-time'},
                    },
                },
                PaymentStatusUpdate: {
                    type: 'object',
                    required: ['payment_status'],
                    properties: {
                        payment_status: {
                            type: 'string',
                            enum: ['pending', 'paid', 'cancelled', 'rejected', 'expired'],
                        },
                    },
                },
            },
        },
        tags: [
            {name: 'Products', description: 'CRUD de productos'},
            {name: 'Auth', description: 'Autenticación de clientes'},
            {name: 'Orders', description: 'Pedidos de clientes autenticados'},
            {name: 'Admin', description: 'Gestión administrativa (solo admin)'},
        ],
    },
    apis: ['./routes/*.routes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
