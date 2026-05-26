import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { adminService } from '../services/admin.service';

const STATUS_OPTIONS = ['pending', 'paid', 'cancelled', 'rejected', 'expired'];

const STATUS_LABELS = {
  pending: 'Pendiente',
  paid: 'Pagado',
  cancelled: 'Cancelado',
  rejected: 'Rechazado',
  expired: 'Expirado',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-orange-100 text-orange-800',
};

export const PaymentManagement = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (err) {
      if (err.message.includes('Token') || err.message.includes('acceso')) {
        logout();
        navigate('/');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setFeedback(null);
    try {
      const updated = await adminService.updatePaymentStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      setFeedback({ type: 'success', message: `Estado actualizado a "${STATUS_LABELS[newStatus]}"` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-6">Solo administradores pueden acceder a esta sección.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Volver a Tienda
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
            <p className="text-sm text-gray-500">Panel de administración</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.name} <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">admin</span>
            </span>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              ← Tienda
            </button>
          </div>
        </div>
      </header>

      {feedback && (
        <div className={`max-w-7xl mx-auto px-4 mt-4 ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'} border rounded-lg p-3 text-sm font-medium`}>
          {feedback.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-lg">Cargando pedidos...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            Error: {error}
            <button onClick={fetchOrders} className="ml-4 underline font-semibold">Reintentar</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">No hay pedidos registrados.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rose-100 text-gray-700 text-sm uppercase tracking-wider">
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Cliente</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Método de Pago</th>
                    <th className="px-4 py-3 font-semibold">Estado Pago</th>
                    <th className="px-4 py-3 font-semibold">Fecha</th>
                    <th className="px-4 py-3 font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-rose-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-sm text-gray-500">#{order.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{order.user_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{order.user_email}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        ${(order.total_price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                        {order.payment_method || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
                          {STATUS_LABELS[order.payment_status] || order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.payment_status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 disabled:opacity-50 disabled:cursor-wait"
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                        {updatingId === order.id && (
                          <span className="ml-2 text-xs text-gray-400">Actualizando...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
