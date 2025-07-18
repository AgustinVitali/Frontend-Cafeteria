import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { MenuItem, OrderItem } from '../../types';
import MenuCard from './MenuCard';

interface MenuViewProps {
  adminMode?: boolean;
  onEditItem?: (item: MenuItem) => void;
  onDeleteItem?: (id: string) => void;
}

const MenuView: React.FC<MenuViewProps> = ({ adminMode = false, onEditItem, onDeleteItem }) => {
  const { isAuthenticated, hasRole, getAccessToken } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      let items: MenuItem[];
      if (adminMode && isAuthenticated) {
        const token = await getAccessToken();
        items = await apiService.getFullMenu(token);
      } else {
        items = await apiService.getPublicMenu();
      }

      setMenuItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem, quantity: number = 1, notes?: string) => {
    const existingItem = cart.find(cartItem => cartItem.menuItemId === item.id);

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.menuItemId === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      const newCartItem: OrderItem = {
        id: Date.now().toString(),
        menuItemId: item.id,
        menuItemName: item.name,
        quantity,
        price: item.price,
        notes
      };
      setCart([...cart, newCartItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const placeOrder = async () => {
    if (!isAuthenticated || cart.length === 0) return;

    try {
      const token = await getAccessToken();
      await apiService.createOrder(cart, token);
      setCart([]);
      alert('¡Pedido realizado con éxito!');
    } catch (error) {
      alert('Error al realizar el pedido');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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
          onClick={loadMenu}
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
          {adminMode ? 'Administrar Menú' : 'Nuestro Menú'}
        </h1>
        <p className="text-coffee-600">
          {adminMode ? 'Gestiona los productos del menú' : 'Descubre nuestros deliciosos productos'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={addToCart}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            adminMode={adminMode}
            canOrder={isAuthenticated && hasRole('cliente')}
          />
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-coffee-600">No hay productos disponibles en el menú</p>
        </div>
      )}

      {/* Carrito de compras */}
      {isAuthenticated && hasRole('cliente') && !adminMode && cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
          <h3 className="text-lg font-semibold text-coffee-800 mb-3">
            Carrito ({cart.length} items)
          </h3>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-sm font-medium">{item.menuItemName}</span>
                  <span className="text-xs text-coffee-600 ml-2">
                    ${item.price} x {item.quantity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 bg-coffee-200 rounded-full flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 bg-coffee-200 rounded-full flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Total: ${getTotalPrice().toFixed(2)}</span>
            </div>
            <button
              onClick={placeOrder}
              className="w-full bg-coffee-600 hover:bg-coffee-700 text-white py-2 px-4 rounded"
            >
              Realizar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuView; 