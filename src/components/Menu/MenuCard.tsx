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

  // Usar image si existe, si no, usar image (por compatibilidad con backend hardcodeado)
  const imageSrc = item.image || (item as any).image;
  const isAvailable = Boolean(item.available);

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 border border-coffee-100 ${!isAvailable ? 'opacity-60' : ''} h-full min-h-[480px] flex flex-col`}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-56 object-cover object-center rounded-t-2xl"
        />
      )}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-coffee-800">{item.name}</h3>
          <span className="text-2xl font-extrabold text-coffee-600">${item.price}</span>
        </div>
        <span className="inline-block bg-coffee-200 text-coffee-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 self-start">
          {item.category}
        </span>
        <p className="text-coffee-700 text-base mb-4 flex-1">{item.description}</p>
        <div className="flex space-x-2 mt-auto">
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
                disabled={!isAvailable}
                className={`w-full py-2 px-4 rounded-lg text-base font-semibold shadow transition-all duration-150 ${
                  isAvailable
                    ? 'bg-coffee-600 hover:bg-coffee-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAvailable ? 'Agregar al carrito' : 'No disponible'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard; 