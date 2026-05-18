import request from 'supertest';
import app from '../index.js';
import { sequelize, Product } from '../models/index.js';

// Antes de todos los tests: crear las tablas limpias en la BD de test
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Después de todos los tests: cerrar la conexión
afterAll(async () => {
  await sequelize.close();
});

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
      .send(nuevoProducto);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Waffle con Berries');
    expect(res.body.id).toBeDefined();
  });

  it('debe rechazar un producto sin nombre (validación)', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ category: 'Cake', price: 5.00 });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('debe rechazar un precio negativo', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test', category: 'Test', price: -1 });

    expect(res.statusCode).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────
describe('GET /api/products/:id', () => {
  it('debe retornar 404 para un ID inexistente', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.statusCode).toBe(404);
  });

  it('debe retornar el producto si existe', async () => {
    // Primero creamos uno
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
    const res = await request(app).delete(`/api/products/${creado.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('eliminado');
  });
});