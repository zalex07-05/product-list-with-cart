import { Router } from 'express';
import { validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import { createOrder } from '../controllers/order.controller.js';
import { createOrderValidation } from '../validators/order.validator.js';

const router = Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crea un nuevo pedido (cliente autenticado)
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
 *               - payment_method
 *               - delivery_address
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_name
 *                     - unit_price
 *                     - quantity
 *                   properties:
 *                     product_name:
 *                       type: string
 *                     unit_price:
 *                       type: number
 *                     quantity:
 *                       type: integer
 *               payment_method:
 *                 type: string
 *               delivery_address:
 *                 type: string
 *               delivery_notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token requerido
 */
router.post(
  '/',
  authenticate,
  createOrderValidation,
  handleValidationErrors,
  createOrder,
);

export default router;
