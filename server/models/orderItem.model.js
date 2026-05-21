import { DataTypes } from 'sequelize';
import { sequelizeOrders } from '../config/database.js';
import Order from './order.model.js';

// Modelo para el detalle del pedido (OrderItem)
// Almacena cada producto incluido en un pedido de forma inmutable
const OrderItem = sequelizeOrders.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Referencia lógica al microservicio de Productos
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false, // Inmutabilidad: Guardar el nombre al comprar por si cambia en el catálogo
  },
  unit_price: {
    type: DataTypes.DOUBLE,
    allowNull: false, // Inmutabilidad: Guardar el precio al comprar por si cambia en el catálogo
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
}, {
  tableName: 'order_items',
  timestamps: true,
});

// Definir la asociación física de Sequelize (ya que ambos viven en la misma base de datos de Pedidos)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

export default OrderItem;
