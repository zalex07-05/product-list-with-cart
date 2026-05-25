import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role || 'customer' },
      JWT_SECRET,
      { expiresIn: '1d' },
    );

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role || 'customer',
    };

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'customer' },
      JWT_SECRET,
      { expiresIn: '1d' },
    );

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'customer',
    };

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
