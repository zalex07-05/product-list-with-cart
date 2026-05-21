import sequelize from '../config/database.js';
import Product from './product.model.js';
import User from './user.model.js';

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Base de datos sincronizada');
};

export { sequelize, Product, User, syncDatabase };
