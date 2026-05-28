import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './config/swagger.js';
import productRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import orderRoutes from './routes/orders.routes.js';
import {syncDatabase} from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ── CORS ───────────────────────────────────────────────────────────
// Sin esto el navegador bloquea las peticiones desde el frontend
// porque considera que vienen de un "origen cruzado" (cross-origin).
// En desarrollo permite localhost:5173; en producción usa FRONTEND_URL.
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// ── Morgan ─────────────────────────────────────────────────────────
// Registra en consola cada petición que llega al servidor.
// Ejemplo: GET /api/products 200 4.532 ms
app.use(morgan('dev'));

// ── Body Parser ────────────────────────────────────────────────────
// Permite leer req.body cuando el cliente envía JSON
app.use(express.json());

// ── Rutas ──────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// ── Swagger ────────────────────────────────────────────────────────
// Documentación interactiva disponible en http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Health check ───────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        message: '🍰 Desserts API funcionando',
        docs: `${req.protocol}://${req.get('host')}/api-docs`,
    });
});

// ── Iniciar ────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
    syncDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📄 Swagger en /api-docs`);
        });
    });
}

export default app; // necesario para Supertest en los tests
