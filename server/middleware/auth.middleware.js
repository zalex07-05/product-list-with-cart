import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_for_desserts_api';

// Middleware para verificar la validez del token JWT
// e inyectar el usuario autenticado en la petición (req.user)
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
