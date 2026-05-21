import React from 'react';
import { CartConfirmItem } from './cart-confirm-item';
import { CartTotal } from './cart-total';
import { CartButton } from './cart-button';
import { useCartStore } from '../store/cart.store';

export const CartConfirmation = () => {
  const { isClose, toggleClose, cart, resetCart } = useCartStore();

  const handleNewOrder = () => {
    resetCart();
    toggleClose();
  };

  if (isClose) return null;

  return (
    <dialog open={!isClose} className='bg-black/50 w-full fixed inset-0 z-50 h-screen grid place-content-center overflow-y-auto py-10'>
      <div className='w-[375px] md:w-[600px] py-10 px-6 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin'>
        <div>
          <img src="/assets/images/icon-order-confirmed.svg" alt="icon-order-confirmed" className="mb-4" />
          <h2 className='text-[2.2rem] font-bold text-Rose-900 leading-tight mb-1'>Order Confirmed</h2>
          <p className='text-Rose-500 mb-6 text-sm'>We hope you enjoy your food!</p>
          
          <div className="bg-Rose-50 p-4 rounded-lg mb-6 border border-Rose-100">
            <div className='max-h-40 overflow-y-auto mb-2 pr-1'>
              {cart.map(item => <CartConfirmItem key={item.name} {...item} />)}
            </div>
            <CartTotal />
          </div>

          <CartButton onClick={handleNewOrder} text="Start New Order" />
        </div>
      </div>
    </dialog>
  );
};
