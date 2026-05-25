import { DataTypes } from 'sequelize';
import { sequelizePedidos } from '../config/database.js';

const Order = sequelizePedidos.define('Order', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  delivery_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  delivery_notes: {
    type: DataTypes.STRING,
  },
  total_price: {
    type: DataTypes.FLOAT,
    defaultValue: 0.00,
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

export default Order;
