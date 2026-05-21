import sequelize, { sequelizeAuth } from '../config/database.js';
import Product from './product.model.js';
import User from './user.model.js';

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Base de datos principal (productos) sincronizada');
  
  await sequelizeAuth.sync({ alter: true });
  console.log('Base de datos de autenticación (usuarios) sincronizada');
};

export { sequelize, sequelizeAuth, Product, User, syncDatabase };
