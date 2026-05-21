import sequelize from '../config/database.js';
import Product from './product.model.js';

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Base de datos principal (productos) sincronizada');
};

export { sequelize, Product, syncDatabase };

