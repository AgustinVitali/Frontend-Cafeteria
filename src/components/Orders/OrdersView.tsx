import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { Order } from '../../types';
import OrderCard from './OrderCard';

interface OrdersViewProps {
  userView?: boolean;
}

const OrdersView: React.FC<OrdersViewProps> = ({ userView = false }) => {
  const { getAccessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAccessToken();
      let ordersList: Order[];
      
      if (userView) {
        ordersList = await apiService.getMyOrders(token);
      } else {
        ordersList = await apiService.getAllOrders(token);
      }
      
      setOrders(ordersList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = await getAccessToken();
      await apiService.updateOrderStatus(orderId, newStatus, token);
      
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as Order['status'] }
          : order
      ));
    } catch (error) {
      alert('Error al actualizar el estado del pedido');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Preparación';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadOrders}
          className="bg-coffee-600 hover:bg-coffee-700 text-white px-4 py-2 rounded"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-coffee-800 mb-2">
          {userView ? 'Mis Pedidos' : 'Gestión de Pedidos'}
        </h1>
        <p className="text-coffee-600">
          {userView ? 'Historial de tus pedidos' : 'Administra todos los pedidos de la cafetería'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-coffee-600">
            {userView ? 'No tienes pedidos aún' : 'No hay pedidos para mostrar'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateOrderStatus}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              userView={userView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersView; 