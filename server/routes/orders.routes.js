import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/orders.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Simulación de Pedidos (Microservicio de Pedidos)
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Confirma el carrito y crea un nuevo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - delivery_address
 *               - payment_method
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - quantity
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: 'Waffle with Berries'
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               delivery_address:
 *                 type: string
 *                 example: 'Av. Las Palmas #123, San Salvador'
 *               delivery_notes:
 *                 type: string
 *                 example: 'Casa de portón negro, tocar timbre secundario.'
 *               payment_method:
 *                 type: string
 *                 example: 'cash'
 *     responses:
 *       201:
 *         description: Pedido confirmado y guardado exitosamente
 *       400:
 *         description: Datos inválidos u obligatorios faltantes
 *       401:
 *         description: No autorizado (Token faltante o expirado)
 *       404:
 *         description: Producto no encontrado en la base de datos de catálogo
 */
router.post('/', authenticateJWT, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtiene el historial de pedidos del usuario autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos devuelta con éxito
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getUserOrders);

export default router;
