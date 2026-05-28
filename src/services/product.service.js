import { API_URL } from '../config.js';
const RESOURCE = `${API_URL}/api/products`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const productService = {
  async getProducts() {
    const res = await fetch(`${RESOURCE}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al obtener productos');
    return data;
  },

  async createProduct(productData) {
    const res = await fetch(`${RESOURCE}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.errors?.[0]?.msg || 'Error al crear producto');
    return data;
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${RESOURCE}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.errors?.[0]?.msg || 'Error al actualizar producto');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`${RESOURCE}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al eliminar producto');
    return data;
  },
};
