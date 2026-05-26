import React, { useState } from 'react';
import { CartConfirmItem } from './cart-confirm-item';
import { CartTotal } from './cart-total';
import { CartButton } from './cart-button';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';

export const CartConfirmation = () => {
  const { isClose, toggleClose, cart, resetCart, confirmOrder } = useCartStore();
  const { user, openLoginModal } = useAuthStore();

  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setErrorMessage('Por favor ingresa una dirección de entrega');
      return;
    }
    setErrorMessage('');
    setStatus('loading');
    try {
      const order = await confirmOrder(address.trim(), notes.trim(), paymentMethod);
      setPlacedOrder(order);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || 'Error al procesar el pedido');
      setStatus('error');
    }
  };

  const handleNewOrder = () => {
    resetCart();
    setAddress('');
    setNotes('');
    setPaymentMethod('cash');
    setStatus('idle');
    setPlacedOrder(null);
    toggleClose();
  };

  if (isClose) return null;

  return (
    <dialog open={!isClose} className='bg-black/50 w-full fixed inset-0 z-50 h-screen grid place-content-center overflow-y-auto py-10 border-0'>
      <div className='w-[375px] md:w-[600px] py-10 px-6 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin'>
        
        {/* CASO: No ha iniciado sesión */}
        {!user && (
          <div className="text-center">
            <h2 className='text-[2rem] font-bold text-Red mb-4'>¡Falta Iniciar Sesión!</h2>
            <p className='text-Rose-500 mb-6 text-sm'>
              Para poder guardar tus pedidos y simular la venta en tu base de datos de pedidos, necesitas iniciar sesión o registrarte.
            </p>
            <div className="flex flex-col gap-3">
              <CartButton onClick={() => { toggleClose(); openLoginModal(); }} text="Iniciar Sesión / Registrarse" />
              <button 
                onClick={toggleClose} 
                className="text-Rose-500 hover:text-Rose-900 font-semibold py-2 text-sm transition"
              >
                Volver al carrito
              </button>
            </div>
          </div>
        )}

        {/* CASO: Sesión iniciada - Rellenar datos de entrega */}
        {user && status === 'idle' && (
          <div>
            <h2 className='text-[2.2rem] font-bold text-Rose-900 mb-2'>Datos de Entrega</h2>
            <p className='text-Rose-500 mb-6 text-sm'>Completa los detalles para simular la venta en tu base de datos de pedidos.</p>
            
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-Rose-900 mb-1">Dirección de Envío *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Av. Roosevelt #456, San Salvador"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-Rose-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-Red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-Rose-900 mb-1">Notas / Instrucciones (Opcional)</label>
                <textarea 
                  placeholder="Ej. Tocar el timbre blanco, portón negro..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-Rose-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-Red h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-Rose-900 mb-1">Método de Pago</label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2 border border-Rose-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-Red bg-white"
                  >
                    <option value="cash">Efectivo (Cash)</option>
                    <option value="credit_card">Tarjeta (Simulado)</option>
                    <option value="paypal">PayPal (Simulado)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-Rose-900 mb-1">Cliente</label>
                  <input 
                    type="text"
                    disabled
                    value={user.name}
                    className="w-full px-4 py-2 border border-Rose-200 bg-Rose-50 text-sm rounded-lg text-Rose-500 font-medium"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm rounded">
                  {errorMessage}
                </div>
              )}

              <div className="pt-4 flex flex-col gap-3">
                <CartButton type="submit" text="Confirmar y Guardar Pedido" />
                <button 
                  type="button"
                  onClick={toggleClose} 
                  className="text-Rose-500 hover:text-Rose-900 font-semibold py-2 text-sm transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CASO: Cargando */}
        {user && status === 'loading' && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Red mx-auto mb-6"></div>
            <h2 className='text-[1.8rem] font-bold text-Rose-900 mb-2'>Procesando Pedido...</h2>
            <p className='text-Rose-500 text-sm'>Registrando transacción en la base de datos de Pedidos...</p>
          </div>
        )}

        {/* CASO: Error de servidor */}
        {user && status === 'error' && (
          <div className="text-center">
            <h2 className='text-[2rem] font-bold text-red-600 mb-4'>Error al Procesar</h2>
            <p className='text-Rose-600 mb-6 text-sm'>{errorMessage}</p>
            <div className="flex flex-col gap-3">
              <CartButton onClick={() => setStatus('idle')} text="Intentar Nuevamente" />
              <button 
                onClick={toggleClose} 
                className="text-Rose-500 hover:text-Rose-900 font-semibold py-2 text-sm transition"
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {/* CASO: Pedido Exitoso */}
        {user && status === 'success' && placedOrder && (
          <div>
            <img src="/assets/images/icon-order-confirmed.svg" alt="icon-order-confirmed" className="mb-4" />
            <h2 className='text-[2.2rem] font-bold text-Rose-900 leading-tight mb-1'>¡Pedido Confirmado!</h2>
            <p className='text-Rose-500 mb-4 text-sm'>Tu pedido ha sido guardado exitosamente en tu base de datos de Pedidos.</p>
            
            <div className="bg-Rose-50 p-4 rounded-lg mb-6 border border-Rose-100">
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-Rose-200 text-sm">
                <span className="font-bold text-Rose-900">ID del Pedido: #{placedOrder.id}</span>
                <span className="capitalize px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-semibold">
                  {placedOrder.order_status}
                </span>
              </div>
              <div className='max-h-40 overflow-y-auto mb-2 pr-1'>
                {cart.map(item => <CartConfirmItem key={item.name} {...item} />)}
              </div>
              <CartTotal />
            </div>

            <div className="bg-Rose-100 p-3 rounded-lg text-xs text-Rose-700 mb-6">
              <span className="font-bold block mb-1">📍 Dirección de entrega simulada:</span>
              {placedOrder.delivery_address}
            </div>

            <CartButton onClick={handleNewOrder} text="Iniciar Nuevo Pedido" />
          </div>
        )}

      </div>
    </dialog>
  );
};
