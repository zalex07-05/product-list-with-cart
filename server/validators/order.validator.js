import { body, param } from 'express-validator';
import { z } from 'zod';

const VALID_PAYMENT_STATUSES = ['pending', 'paid', 'cancelled', 'rejected', 'expired'];

// ── Create Order ───────────────────────────────────────────────────
export const createOrderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('El pedido debe contener al menos un producto'),
  body('items.*.product_name')
    .notEmpty().withMessage('El nombre del producto es requerido'),
  body('items.*.unit_price')
    .isFloat({ min: 0.01 }).withMessage('El precio unitario debe ser un número positivo'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),
  body('payment_method')
    .notEmpty().withMessage('El método de pago es requerido'),
  body('delivery_address')
    .notEmpty().withMessage('La dirección de entrega es requerida'),
];

export const CreateOrderSchema = z.object({
  items: z.array(z.object({
    product_name: z.string().min(1, 'Nombre del producto requerido'),
    unit_price: z.number().positive('Precio unitario debe ser positivo'),
    quantity: z.number().int().min(1, 'Cantidad debe ser al menos 1'),
  })).min(1, 'Debe tener al menos un producto'),
  payment_method: z.string().min(1, 'Método de pago requerido'),
  delivery_address: z.string().min(1, 'Dirección requerida'),
  delivery_notes: z.string().optional(),
});

// ── Payment Status Update ──────────────────────────────────────────
export const paymentStatusValidation = [
  param('orderId')
    .isInt({ min: 1 }).withMessage('ID de pedido inválido'),
  body('payment_status')
    .notEmpty().withMessage('El estado de pago es requerido')
    .isIn(VALID_PAYMENT_STATUSES)
    .withMessage(`Estado inválido. Valores: ${VALID_PAYMENT_STATUSES.join(', ')}`),
];

export const PaymentStatusSchema = z.object({
  payment_status: z.enum(VALID_PAYMENT_STATUSES, {
    errorMap: () => ({ message: `Estado inválido. Valores: ${VALID_PAYMENT_STATUSES.join(', ')}` }),
  }),
});
