import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Este modelo define la estructura de la tabla "products"
// Sequelize la crea automáticamente en PostgreSQL
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image_thumbnail: { type: DataTypes.STRING },
  image_mobile:    { type: DataTypes.STRING },
  image_tablet:    { type: DataTypes.STRING },
  image_desktop:   { type: DataTypes.STRING },
}, {
  tableName: process.env.NODE_ENV === 'test' ? 'products_test' : 'products',
  timestamps: true,
});

export default Product;