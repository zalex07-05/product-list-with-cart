import { body } from 'express-validator';
import { z } from 'zod';

// ── Express-Validator ─────────────────────────────────────────────
// Cada regla es un middleware que se pasa en el array de la ruta.
// Si falla, agrega errores a req y los revisamos con validationResult()
export const productValidationRules = [
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto'),
  body('category')
    .notEmpty().withMessage('La categoría es requerida'),
  body('price')
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser un número positivo'),
];

// ── Zod ───────────────────────────────────────────────────────────
// Definimos el "shape" esperado de los datos.
// safeParse() no lanza excepción: retorna { success, data } o { success, error }
export const ProductSchema = z.object({
  name:            z.string().min(1, 'El nombre es requerido'),
  category:        z.string().min(1, 'La categoría es requerida'),
  price:           z.number().positive('El precio debe ser positivo'),
  image_thumbnail: z.string().optional(),
  image_mobile:    z.string().optional(),
  image_tablet:    z.string().optional(),
  image_desktop:   z.string().optional(),
});

// Middleware reutilizable que valida con cualquier esquema Zod
export const validateWithZod = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.validatedData = result.data;
  next();
};