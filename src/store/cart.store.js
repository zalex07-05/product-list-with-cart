import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  isClose: true,
  cart: [],
  products: [],
  loading: false,
  error: null,

  // Obtiene los productos desde el backend en lugar del JSON local
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('http://localhost:3000/api/products');
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();

      // Convertimos el formato de la BD al formato que espera el frontend
      const formatted = data.map(p => ({
        name: p.name,
        category: p.category,
        price: p.price,
        image: {
          thumbnail: p.image_thumbnail,
          mobile: p.image_mobile,
          tablet: p.image_tablet,
          desktop: p.image_desktop,
        },
      }));

      set({ products: formatted, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  toggleClose: () => set((state) => ({ isClose: !state.isClose })),
  resetCart: () => set(() => ({ cart: [] })),
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