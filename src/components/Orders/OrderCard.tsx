import React from 'react';
import { Order } from '../../types';

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
  getStatusColor: (status: Order['status']) => string;
  getStatusText: (status: Order['status']) => string;
  userView?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
  getStatusColor,
  getStatusText,
  userView = false
}) => {
  // Mapeo de status para backend
  const statusMap: Record<string, string> = {
    pending: "PENDIENTE",
    in_progress: "EN_PROGRESO",
    completed: "COMPLETED",
    cancelled: "CANCELLED"
  };

  const handleStatusChange = (newStatus: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, statusMap[newStatus] || newStatus);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Normalizar el estado para que funcione con mayúsculas/minúsculas y español/inglés
  const normalizedStatus = (() => {
    if (!order.status) return '';
    const s = order.status.toLowerCase();
    if (s === 'pendiente') return 'pending';
    if (s === 'en_progreso') return 'in_progress';
    if (s === 'completado' || s === 'completed') return 'completed';
    if (s === 'cancelado' || s === 'cancelled') return 'cancelled';
    return s;
  })();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-coffee-100 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-coffee-800 mb-1">
            Pedido #{order.id}
          </h3>
          <p className="text-sm text-coffee-600 mb-1">
            {/* Si el backend quiere mostrar el correo, debe incluirlo en la respuesta del pedido, por ejemplo como order.customerEmail */}
            <span className="font-semibold">Cliente:</span> {order.customerName || order.userId || "Desconocido"}
          </p>
          <p className="text-sm text-coffee-600">
            <span className="font-semibold">Fecha:</span> {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(normalizedStatus as Order['status'])} border border-coffee-200`}> 
            {getStatusText(normalizedStatus as Order['status'])}
          </span>
          <p className="text-lg font-bold text-coffee-800 mt-2">
            Total: ${order.total.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="mb-2">
        <h4 className="font-medium text-coffee-800 mb-2">Productos:</h4>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                {/* Si el backend quiere mostrar el nombre, debe incluir menuItem: { name } o menuItemName */}
                <span className="font-medium">{(item as any).menuItem?.name || item.menuItemName || 'Producto'}</span>
                <span className="text-sm text-coffee-600 ml-2">x{item.quantity}</span>
                {item.notes && (
                  <p className="text-xs text-coffee-500 italic">Nota: {item.notes}</p>
                )}
              </div>
              <span className="text-coffee-600">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Controles para baristas/admins */}
      {!userView && normalizedStatus !== 'completed' && normalizedStatus !== 'cancelled' && (
        <div className="flex space-x-2 mt-4">
          {normalizedStatus === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange('in_progress')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm shadow"
              >
                Iniciar Preparación
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm shadow"
              >
                Cancelar
              </button>
            </>
          )}
          {normalizedStatus === 'in_progress' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm shadow"
            >
              Marcar como Completado
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard; 