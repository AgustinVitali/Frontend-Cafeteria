import React from 'react';
import { MenuItem } from '../../types';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (id: string) => void;
  adminMode?: boolean;
  canOrder?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onAddToCart,
  onEdit,
  onDelete,
  adminMode = false,
  canOrder = false
}) => {
  const handleAddToCart = () => {
    if (onAddToCart && item.available) {
      onAddToCart(item, 1);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      onDelete(item.id);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${!item.available ? 'opacity-60' : ''}`}>
      {item.imageUrl && (
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-coffee-800">{item.name}</h3>
          <span className="text-lg font-bold text-coffee-600">${item.price}</span>
        </div>
        
        <p className="text-coffee-600 text-sm mb-2">{item.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs bg-coffee-100 text-coffee-800 px-2 py-1 rounded">
            {item.category}
          </span>
          
          {!item.available && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              No disponible
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          {adminMode ? (
            <>
              <button
                onClick={handleEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
              >
                Eliminar
              </button>
            </>
          ) : (
            canOrder && (
              <button
                onClick={handleAddToCart}
                disabled={!item.available}
                className={`w-full py-2 px-4 rounded text-sm font-medium ${
                  item.available
                    ? 'bg-coffee-600 hover:bg-coffee-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {item.available ? 'Agregar al carrito' : 'No disponible'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard; 