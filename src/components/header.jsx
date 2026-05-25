import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const Header = () => {
  const { user, openLoginModal, openRegisterModal, logout } = useAuthStore();

  return (
    <header className="flex justify-between items-center mb-[30px] border-b pb-4">
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
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition-colors"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button
              onClick={openLoginModal}
              className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-full font-semibold transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={openRegisterModal}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition-colors"
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </header>
  );
};
