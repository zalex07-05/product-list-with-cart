import { API_URL } from '../config.js';
const RESOURCE = `${API_URL}/api/admin`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const adminService = {
  async getOrders() {
    const res = await fetch(`${RESOURCE}/orders`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al obtener pedidos');
    return data;
  },

  async updatePaymentStatus(orderId, paymentStatus) {
    const res = await fetch(`${RESOURCE}/orders/${orderId}/payment-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ payment_status: paymentStatus }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.errors?.[0]?.msg || 'Error al actualizar');
    return data;
  },

  async updateOrderStatus(orderId, orderStatus) {
    const res = await fetch(`${RESOURCE}/orders/${orderId}/order-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order_status: orderStatus }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.errors?.[0]?.msg || 'Error al actualizar estado del pedido');
    return data;
  },
};
