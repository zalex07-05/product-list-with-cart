import { useState } from 'react';
import { CartConfirmItem } from './cart-confirm-item';
import { CartTotal } from './cart-total';
import { CartButton } from './cart-button';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import { orderService } from '../services/order.service';

export const CartConfirmation = () => {
  const { isClose, toggleClose, cart, resetCart } = useCartStore();
  const { user, openLoginModal } = useAuthStore();

  const [step, setStep] = useState('confirm');
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  const resetState = () => {
    setStep('confirm');
    setPaymentMethod('tarjeta');
    setDeliveryAddress('');
    setDeliveryNotes('');
    setSubmitting(false);
    setError(null);
    setCreatedOrder(null);
  };

  const handleClose = () => {
    toggleClose();
    if (step === 'success') {
      resetCart();
    }
    resetState();
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (!deliveryAddress.trim()) {
      setError('La dirección de entrega es requerida');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const items = cart.map(item => ({
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      }));

      const order = await orderService.createOrder({
        items,
        payment_method: paymentMethod,
        delivery_address: deliveryAddress.trim(),
        delivery_notes: deliveryNotes.trim() || undefined,
      });

      setCreatedOrder(order);
      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewOrder = () => {
    resetCart();
    resetState();
    toggleClose();
  };

  if (isClose) return null;

  return (
    <div className='bg-black/50 w-full fixed h-screen grid place-content-center z-50'>
      <div className='w-[375px] md:w-[600px] py-10 px-6 bg-white rounded-xl max-h-[90vh] overflow-y-auto'>
        {step === 'success' ? (
          <>
            <img src="/assets/images/icon-order-confirmed.svg" alt="icon-order-confirmed" />
            <h2 className='text-[2.5rem] font-bold'>Order Confirmed</h2>
            <p className='text-Rose-500 mb-2'>We hope you enjoy your food!</p>
            {createdOrder && (
              <p className='text-sm text-Rose-400 mb-6'>
                Pedido #{createdOrder.id} — {new Date(createdOrder.created_at).toLocaleString('es-MX')}
              </p>
            )}

            <div className='bg-Rose-50 rounded-lg'>
              {cart.map(item => (
                <CartConfirmItem key={item.name} {...item} />
              ))}
              <CartTotal />
            </div>

            {createdOrder?.payment_status === 'pending' && (
              <p className='text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg mt-4 mb-4'>
                💳 Pago pendiente — el administrador actualizará el estado
              </p>
            )}

            <CartButton onClick={handleNewOrder} text="Start New Order" />
          </>
        ) : (
          <>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold'>Confirmar Pedido</h2>
              <button onClick={handleClose} className='text-gray-400 hover:text-gray-600 text-xl'>&times;</button>
            </div>

            <div className='bg-Rose-50 rounded-lg mb-6'>
              {cart.map(item => (
                <CartConfirmItem key={item.name} {...item} />
              ))}
              <CartTotal />
            </div>

            <div className='mb-6 space-y-4'>
              <div>
                <label className='block text-sm font-semibold mb-1 text-gray-700'>Método de Pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white'
                >
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="oxxo">Pago en OXXO</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold mb-1 text-gray-700'>Dirección de Entrega *</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Calle, número, colonia, ciudad"
                  className='w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold mb-1 text-gray-500'>Notas de entrega (opcional)</label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Ej: Dejar con el vecino, tocar timbre..."
                  className='w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none h-20'
                />
              </div>
            </div>

            {!user && (
              <div className='bg-blue-50 text-blue-700 text-sm p-3 rounded-lg mb-4'>
                Necesitas{' '}
                <button onClick={openLoginModal} className='font-semibold underline'>iniciar sesión</button>
                {' '}para confirmar el pedido.
              </div>
            )}

            {error && (
              <div className='bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4'>{error}</div>
            )}

            <button
              onClick={handleSubmitOrder}
              disabled={submitting || !deliveryAddress.trim()}
              className='w-full bg-Red text-Rose-50 p-4 rounded-full font-semibold cursor-pointer hover:bg-Red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {submitting ? 'Procesando pedido...' : 'Confirmar y Pagar'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
