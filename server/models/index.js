import sequelize, { sequelizeAuth, sequelizePedidos } from '../config/database.js';
import Product from './product.model.js';
import User from './user.model.js';
import Order from './order.model.js';
import OrderItem from './order-item.model.js';

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Base de datos principal (productos) sincronizada');

  await sequelizeAuth.sync({ alter: true });
  console.log('Base de datos de autenticación (usuarios) sincronizada');

  await sequelizePedidos.sync({ alter: true });
  console.log('Base de datos de pedidos (orders + order_items) sincronizada');
};

export { sequelize, sequelizeAuth, sequelizePedidos, Product, User, Order, OrderItem, syncDatabase };
