import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_for_desserts_api';

// Middleware para verificar la validez del token JWT
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
  }

  // Espera formato "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    req.user = user; // Inyecta { id, email } en req
    next();
  });
};

// Alias de autenticación para compatibilidad
export const authenticate = authenticateJWT;

// Middleware para verificar que el usuario tenga rol de administrador
export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }
    req.user.role = user.role;
    next();
  } catch (err) {
    console.error('Error en requireAdmin:', err);
    return res.status(500).json({ message: 'Error al verificar permisos' });
  }
};
