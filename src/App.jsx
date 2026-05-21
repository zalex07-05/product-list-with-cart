import { useEffect } from 'react';
import { CardsContainer } from './components/cards-container';
import { Cart } from './components/cart';
import { CartConfirmation } from './components/cart-confirmation';
import { useCartStore } from './store/cart.store';
import { Header } from './components/header';
import { LoginModal } from './components/login-modal';
import { RegisterModal } from './components/register-modal';
import { OrdersHistory } from './components/orders-history';

function App() {
  const { fetchProducts, loading, error } = useCartStore();

  // Al montar la app, cargamos los productos del servidor
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando productos...</p>;
  if (error)   return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <main className='flex justify-center'>
      <section className='my-6 w-full max-w-[1200px] px-4'>
        <Header />
        
        <div className='desktop:flex desktop:gap-8 desktop:items-start'>
          <CardsContainer />
          <Cart />
        </div>
      </section>
      
      <CartConfirmation />
      <LoginModal />
      <RegisterModal />
      <OrdersHistory />
    </main>
  );
}

export default App;

