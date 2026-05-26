<<<<<<< HEAD
import { useAuthStore } from '../store/auth.store';
import { useCartStore } from '../store/cart.store';
=======
﻿import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
>>>>>>> Pedidos

export const Header = () => {
  const { user, openLoginModal, openRegisterModal, logout } = useAuthStore();
  const { toggleOrders } = useCartStore();

  return (
    <header className="flex justify-between items-center mb-[30px] border-b pb-4">
<<<<<<< HEAD
      <h1 className="text-[2.5rem] font-bold text-Rose-900">Desserts</h1>
      
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="font-semibold text-Rose-900 text-sm">Hola, {user.name}</span>
            <button 
              onClick={toggleOrders}
              className="border border-Rose-500 text-Rose-950 hover:bg-Rose-100 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Mis Pedidos 🍕
            </button>
            <button 
=======
      <Link to="/" className="text-[2.5rem] font-bold no-underline text-black">Desserts</Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="font-semibold text-gray-700">Hola, {user.name}</span>
            {user.role === 'admin' && (
              <Link
                to="/admin/pagos"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors"
              >
                Admin Pagos
              </Link>
            )}
            <button
>>>>>>> Pedidos
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button
              onClick={openLoginModal}
              className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={openRegisterModal}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </header>
  );
};

