import { Order, OrderItem, Product } from '../models/index.js';
import { sequelizeOrders } from '../config/database.js';

// Crear un nuevo pedido (Checkout)
export const createOrder = async (req, res) => {
  const transaction = await sequelizeOrders.transaction();
  try {
    const { items, delivery_address, delivery_notes, payment_method } = req.body;
    const user_id = req.user.id; // Del middleware jwt

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El carrito no puede estar vacío' });
    }

    if (!delivery_address) {
      return res.status(400).json({ message: 'La dirección de entrega es obligatoria' });
    }

    if (!payment_method) {
      return res.status(400).json({ message: 'El método de pago es obligatorio' });
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    // Validar productos y precios contra la base de datos de productos (Microservicio de Productos)
    for (const item of items) {
      const product = await Product.findOne({ where: { name: item.name } });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: `El producto "${item.name}" no existe en el catálogo` });
      }

      const itemQty = Number(item.quantity);
      if (isNaN(itemQty) || itemQty <= 0) {
        await transaction.rollback();
        return res.status(400).json({ message: `Cantidad inválida para el producto "${item.name}"` });
      }

      const itemSubtotal = product.price * itemQty;
      calculatedTotal += itemSubtotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity: itemQty,
      });
    }

    // Insertar pedido en la base de datos de pedidos
    const newOrder = await Order.create({
      user_id,
      order_status: 'pending',
      payment_status: payment_method === 'cash' ? 'pending' : 'paid', // Si es efectivo, queda pendiente; si no, simulamos pago exitoso
      payment_method,
      delivery_address,
      delivery_notes: delivery_notes || '',
      total_price: calculatedTotal,
    }, { transaction });

    // Insertar los productos asociados en la tabla de detalles (order_items)
    const itemsWithOrderId = validatedItems.map(item => ({
      ...item,
      order_id: newOrder.id,
    }));

    await OrderItem.bulkCreate(itemsWithOrderId, { transaction });

    await transaction.commit();

    // Obtener pedido completo con sus detalles para retornar
    const completedOrder = await Order.findByPk(newOrder.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.status(201).json({
      message: 'Pedido confirmado y guardado exitosamente',
      order: completedOrder,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error interno al procesar el pedido' });
  }
};

// Consultar el historial de pedidos de un usuario específico
export const getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const orders = await Order.findAll({
      where: { user_id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error interno al consultar el historial de pedidos' });
  }
};
