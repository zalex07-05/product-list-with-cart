import { DataTypes } from 'sequelize';
import { sequelizePedidos } from '../config/database.js';

const OrderItem = sequelizePedidos.define('OrderItem', {
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'order_items',
  timestamps: true,
});

export default OrderItem;
