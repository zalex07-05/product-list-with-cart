import { sequelizeAuth } from '../config/database.js';
import User from './user.model.js';

const syncDatabase = async () => {
  await sequelizeAuth.sync({ alter: true });
  console.log('Base de datos de autenticación (usuarios) sincronizada');
};

export { sequelizeAuth, User, syncDatabase };

