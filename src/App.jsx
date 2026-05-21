import { Header } from './components/header';
import { LoginModal } from './components/login-modal';
import { RegisterModal } from './components/register-modal';

function App() {
  return (
    <main className='flex justify-center'>
      <section className='my-6 w-full max-w-[1200px] px-4'>
        <Header />
        <div className="text-center py-20 bg-Rose-50 rounded-xl">
          <h2 className="text-2xl font-bold text-Rose-900 mb-2">Portal de Autenticación</h2>
          <p className="text-Rose-500 text-sm">
            Inicia sesión o regístrate usando los botones de la cabecera para ver tu información.
          </p>
        </div>
      </section>
      
      <LoginModal />
      <RegisterModal />
    </main>
  );
}

export default App;

