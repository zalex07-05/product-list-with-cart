import { Sequelize } from 'sequelize';

// Sequelize recibe: nombre de la BD, usuario, contraseña, opciones
// Cambien 'postgres' y 'tu_password' por sus credenciales
const sequelize = new Sequelize('desserts_db', 'postgres', 'tu_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

export default sequelize;