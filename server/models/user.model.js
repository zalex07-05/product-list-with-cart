import { DataTypes } from 'sequelize';
import { sequelizeAuth } from '../config/database.js';

const User = sequelizeAuth.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'customer',
    validate: {
      isIn: [['customer', 'admin']],
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
});

export default User;
