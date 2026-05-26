import { Order, OrderItem, Product, User } from '../models/index.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, payment_method, delivery_address, delivery_notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El pedido debe contener al menos un producto' });
    }

    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const { product_name, unit_price, quantity } = item;

      const product = await Product.findOne({ where: { name: product_name } });
      if (!product) {
        return res.status(400).json({
          message: `Producto no encontrado: "${product_name}"`,
        });
      }

      totalPrice += unit_price * quantity;

      orderItemsData.push({
        product_id: product.id,
        product_name,
        unit_price,
        quantity,
      });
    }

    const order = await Order.create({
      user_id: userId,
      order_status: 'pending',
      payment_status: 'pending',
      payment_method,
      delivery_address,
      delivery_notes: delivery_notes || null,
      total_price: totalPrice,
    });

    const orderItems = orderItemsData.map(item => ({
      ...item,
      order_id: order.id,
    }));
    await OrderItem.bulkCreate(orderItems);

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email'],
    });

    res.status(201).json({
      id: order.id,
      user_id: order.user_id,
      user_name: user?.name || 'Usuario',
      user_email: user?.email || '',
      total_price: order.total_price,
      payment_status: order.payment_status,
      order_status: order.order_status,
      payment_method: order.payment_method,
      delivery_address: order.delivery_address,
      delivery_notes: order.delivery_notes,
      items: orderItemsData,
      created_at: order.createdAt,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
};
