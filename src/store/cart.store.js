import { create } from 'zustand';
import productsData from '../../data.json';

export const useCartStore = create((set, get) => ({
  isClose: true,
  isOrdersOpen: false,
  cart: [],
  products: [],
  loading: false,
  error: null,

  toggleOrders: () => set((state) => ({ isOrdersOpen: !state.isOrdersOpen })),

  // En la rama de Ordenes, cargamos los productos estáticos para simular la compra
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      set({ products: productsData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  toggleClose: () => set((state) => ({ isClose: !state.isClose })),
  resetCart: () => set(() => ({ cart: [] })),
  confirmOrder: async (deliveryAddress, deliveryNotes, paymentMethod) => {
    // Usamos el token simulado
    const token = "dummy-token-for-orders-simulation";

    const items = get().cart.map(item => ({
      name: item.name,
      quantity: item.quantity
    }));

    const res = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items,
        delivery_address: deliveryAddress,
        delivery_notes: deliveryNotes,
        payment_method: paymentMethod
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al procesar el pedido');
    
    return data.order;
  },
  addItemToCart: (newItem) => set((state) => ({
    cart: [...state.cart, newItem],
  })),
  updateItemInCart: (updateItem) => set((state) => ({
    cart: state.cart.map(item =>
      item.name === updateItem.name ? { ...updateItem } : item
    ),
  })),
  deleteItemfromCart: (name) => set((state) => ({
    cart: state.cart.filter(item => item.name !== name),
  })),
  totalCard: () => get().cart.reduce(
    (acc, item) => acc + item.quantity * item.price, 0
  ),
}));