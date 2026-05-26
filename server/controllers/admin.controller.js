import { Order, OrderItem, User } from '../models/index.js';

const VALID_PAYMENT_STATUSES = ['pending', 'paid', 'cancelled', 'rejected', 'expired'];
const VALID_ORDER_STATUSES = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });

    const userIds = [...new Set(orders.map(o => o.user_id))];

    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'name', 'email'],
    });

    const userMap = {};
    users.forEach(u => { userMap[u.id] = u; });

    const result = orders.map(order => ({
      id: order.id,
      user_id: order.user_id,
      user_name: userMap[order.user_id]?.name || 'Usuario desconocido',
      user_email: userMap[order.user_id]?.email || '',
      total_price: order.total_price,
      payment_status: order.payment_status,
      order_status: order.order_status,
      payment_method: order.payment_method,
      delivery_address: order.delivery_address,
      delivery_notes: order.delivery_notes,
      created_at: order.createdAt,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { payment_status } = req.body;

    if (!VALID_PAYMENT_STATUSES.includes(payment_status)) {
      return res.status(400).json({
        message: `Estado inválido. Valores permitidos: ${VALID_PAYMENT_STATUSES.join(', ')}`,
      });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (order.payment_status === 'paid' && payment_status === 'paid') {
      return res.status(400).json({ message: 'El pedido ya está pagado' });
    }

    order.payment_status = payment_status;

    if (['cancelled', 'rejected', 'expired'].includes(payment_status)) {
      order.order_status = 'cancelled';
    }

    await order.save();

    const user = await User.findByPk(order.user_id, {
      attributes: ['id', 'name', 'email'],
    });

    res.json({
      id: order.id,
      user_id: order.user_id,
      user_name: user?.name || 'Usuario desconocido',
      user_email: user?.email || '',
      total_price: order.total_price,
      payment_status: order.payment_status,
      order_status: order.order_status,
      payment_method: order.payment_method,
      delivery_address: order.delivery_address,
      delivery_notes: order.delivery_notes,
      created_at: order.createdAt,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Error al actualizar estado de pago' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;

    if (!VALID_ORDER_STATUSES.includes(order_status)) {
      return res.status(400).json({
        message: `Estado inválido. Valores permitidos: ${VALID_ORDER_STATUSES.join(', ')}`,
      });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    order.order_status = order_status;
    await order.save();

    const user = await User.findByPk(order.user_id, {
      attributes: ['id', 'name', 'email'],
    });

    res.json({
      id: order.id,
      user_id: order.user_id,
      user_name: user?.name || 'Usuario desconocido',
      user_email: user?.email || '',
      total_price: order.total_price,
      payment_status: order.payment_status,
      order_status: order.order_status,
      payment_method: order.payment_method,
      delivery_address: order.delivery_address,
      delivery_notes: order.delivery_notes,
      created_at: order.createdAt,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error al actualizar estado del pedido' });
  }
};
