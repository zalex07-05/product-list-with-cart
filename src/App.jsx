import { useEffect } from 'react';
import { CardsContainer } from './components/cards-container';
import { Cart } from './components/cart';
import { CartConfirmation } from './components/cart-confirmation';
import { useCartStore } from './store/cart.store';

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
      <section className='my-6'>
        <h1 className='text-[2.5rem] font-bold mb-[30px]'>Desserts</h1>
        <div className='desktop:flex desktop:gap-8 desktop:items-start'>
          <CardsContainer />
          <Cart />
        </div>
      </section>
      <CartConfirmation />
    </main>
  );
}

export default App;