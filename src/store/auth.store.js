import { create } from 'zustand';

// Mock de tienda de autenticación para simular sesión en la rama Ordenes
export const useAuthStore = create((set) => ({
  user: { id: 1, name: "Cliente Simulado", email: "simulado@test.com" },
  token: "dummy-token-for-orders-simulation",
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  loading: false,
  error: null,

  openLoginModal: () => {},
  closeLoginModal: () => {},
  openRegisterModal: () => {},
  closeRegisterModal: () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {
    // En la simulación de órdenes no permitimos desloguearse para poder probar las órdenes
  }
}));
