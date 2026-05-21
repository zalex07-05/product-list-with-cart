import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';

export const RegisterModal = () => {
  const { isRegisterModalOpen, closeRegisterModal, register, loading, error } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isRegisterModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl w-[90%] max-w-[400px] shadow-lg relative">
        <button 
          onClick={closeRegisterModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Registrarse</h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-red-500"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-red-500"
              placeholder="correo@ejemplo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-red-500"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-full mt-2 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
};
