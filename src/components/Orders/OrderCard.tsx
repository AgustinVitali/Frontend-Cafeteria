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
  const handleStatusChange = (newStatus: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, newStatus);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-coffee-800">
            Pedido #{order.id}
          </h3>
          {!userView && (
            <p className="text-sm text-coffee-600">
              Cliente: {order.customerName}
            </p>
          )}
          <p className="text-sm text-coffee-600">
            Fecha: {formatDate(order.createdAt)}
          </p>
        </div>
        
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
          <p className="text-lg font-bold text-coffee-800 mt-2">
            Total: ${order.total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-coffee-800 mb-2">Productos:</h4>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <span className="font-medium">{item.menuItemName}</span>
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

      {/* Controles para baristas */}
      {!userView && order.status !== 'completed' && order.status !== 'cancelled' && (
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange('in_progress')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                Iniciar Preparación
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Cancelar
              </button>
            </>
          )}
          
          {order.status === 'in_progress' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
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