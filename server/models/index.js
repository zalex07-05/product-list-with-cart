import sequelize, { sequelizeAuth, sequelizeOrders } from '../config/database.js';
import Product from './product.model.js';
import User from './user.model.js';
import Order from './order.model.js';
import OrderItem from './orderItem.model.js';

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Base de datos principal (productos) sincronizada');
  
  await sequelizeAuth.sync({ alter: true });
  console.log('Base de datos de autenticación (usuarios) sincronizada');
  
  await sequelizeOrders.sync({ alter: true });
  console.log('Base de datos de pedidos (orders) sincronizada');
};

export { sequelize, sequelizeAuth, sequelizeOrders, Product, User, Order, OrderItem, syncDatabase };

