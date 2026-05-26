import { DataTypes } from 'sequelize';
import { sequelizeOrders } from '../config/database.js';

// Modelo para la cabecera del pedido (Orders)
// Almacena información general de la venta
const Order = sequelizeOrders.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Referencia lógica al microservicio de Login
  },
  order_status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending', // 'pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
  },
  payment_status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending', // 'pending', 'paid', 'failed'
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false, // 'credit_card', 'cash', 'paypal'
  },
  delivery_address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  delivery_notes: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  total_price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

export default Order;
