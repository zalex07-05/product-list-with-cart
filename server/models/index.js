import sequelize from '../config/database.js';
import Product from './product.model.js';

// Sincroniza todos los modelos con la BD
// alter: true actualiza columnas si el modelo cambia
const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Base de datos sincronizada');
};

export { sequelize, Product, syncDatabase };