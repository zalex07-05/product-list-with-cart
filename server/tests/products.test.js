import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../index.js';
import { sequelize, sequelizeAuth, Product, User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_for_desserts_api';
let adminToken;

beforeAll(async () => {
  await sequelize.sync({ alter: true });
  await sequelizeAuth.sync({ alter: true });

  // Crear o buscar usuario admin de prueba (evita colisiones y reseteos destructivos)
  const [adminUser] = await User.findOrCreate({
    where: { email: 'admin@prueba.com' },
    defaults: {
      name: 'Admin de Prueba',
      password: 'password_de_prueba',
      role: 'admin',
    }
  });

  adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}, 30000);

afterAll(async () => {
  await sequelize.close();
  await sequelizeAuth.close();
}, 30000);

// ─────────────────────────────────────────────────────────────────
describe('GET /api/products', () => {
  it('debe retornar status 200 y un array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────
describe('POST /api/products', () => {
  it('debe crear un producto con datos válidos', async () => {
    const nuevoProducto = {
      name: 'Waffle con Berries',
      category: 'Waffle',
      price: 6.50,
    };
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(nuevoProducto);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Waffle con Berries');
    expect(res.body.id).toBeDefined();
  });

  it('debe rechazar un producto sin nombre (validación)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ category: 'Cake', price: 5.00 });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debe rechazar un precio negativo', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test', category: 'Test', price: -1 });

    expect(res.statusCode).toBe(400);
  });

  it('debe rechazar la creación si no está autenticado', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Sin Auth', category: 'Test', price: 1.00 });

    expect(res.statusCode).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────
describe('GET /api/products/:id', () => {
  it('debe retornar 404 para un ID inexistente', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.statusCode).toBe(404);
  });

  it('debe retornar el producto si existe', async () => {
    const creado = await Product.create({
      name: 'Brownie',
      category: 'Brownie',
      price: 5.50,
    });
    const res = await request(app).get(`/api/products/${creado.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Brownie');
  });
});

// ─────────────────────────────────────────────────────────────────
describe('DELETE /api/products/:id', () => {
  it('debe eliminar un producto existente', async () => {
    const creado = await Product.create({
      name: 'Para eliminar',
      category: 'Test',
      price: 1.00,
    });
    const res = await request(app)
      .delete(`/api/products/${creado.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('eliminado');
  });

  it('debe rechazar la eliminación si no está autenticado', async () => {
    const creado = await Product.create({
      name: 'Intento Sin Auth',
      category: 'Test',
      price: 1.00,
    });
    const res = await request(app)
      .delete(`/api/products/${creado.id}`);
    expect(res.statusCode).toBe(401);
  });
});