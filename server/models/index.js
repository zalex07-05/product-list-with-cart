import { sequelizeOrders } from '../config/database.js';
import Order from './order.model.js';
import OrderItem from './orderItem.model.js';

const syncDatabase = async () => {
  await sequelizeOrders.sync({ alter: true });
  console.log('Base de datos de pedidos (orders) sincronizada');
};

export { sequelizeOrders, Order, OrderItem, syncDatabase };

