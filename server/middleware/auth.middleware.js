import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

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
