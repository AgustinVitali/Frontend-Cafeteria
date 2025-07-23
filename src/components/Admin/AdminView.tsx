import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { MenuItem } from '../../types';
import MenuView from '../Menu/MenuView';
import MenuItemForm from './MenuItemForm';
import OrdersView from '../Orders/OrdersView';
import BaristasView from './BaristasView';

const AdminView: React.FC = () => {
  const { getAccessToken } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'menu' | 'pedidos' | 'baristas'>('menu');

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const token = await getAccessToken();
      await apiService.deleteMenuItem(id, token);
      setRefreshKey(prev => prev + 1);
      alert('Producto eliminado exitosamente');
    } catch (error) {
      alert('Error al eliminar el producto');
    }
  };

  const handleSaveItem = async (itemData: Omit<MenuItem, 'id'>) => {
    try {
      const token = await getAccessToken();
      if (editingItem) {
        await apiService.updateMenuItem(editingItem.id, itemData, token);
        alert('Producto actualizado exitosamente');
      } else {
        await apiService.addMenuItem(itemData, token);
        alert('Producto agregado exitosamente');
      }
      setShowForm(false);
      setEditingItem(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      alert('Error al guardar el producto');
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-coffee-800 mb-2">
          Panel de Administración
        </h1>
        <p className="text-coffee-600">
          Gestiona los productos del menú y los pedidos de la cafetería
        </p>
      </div>

      {/* Tabs para alternar entre menú y pedidos */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-l-lg font-medium border-t border-l border-b border-coffee-200 focus:outline-none transition-colors ${activeTab === 'menu' ? 'bg-coffee-600 text-white' : 'bg-white text-coffee-800 hover:bg-coffee-100'}`}
          onClick={() => setActiveTab('menu')}
        >
          Menú
        </button>
        <button
          className={`px-6 py-2 font-medium border-t border-b border-coffee-200 focus:outline-none transition-colors ${activeTab === 'pedidos' ? 'bg-coffee-600 text-white' : 'bg-white text-coffee-800 hover:bg-coffee-100'}`}
          onClick={() => setActiveTab('pedidos')}
        >
          Pedidos
        </button>
        <button
          className={`px-6 py-2 rounded-r-lg font-medium border-t border-r border-b border-coffee-200 focus:outline-none transition-colors ${activeTab === 'baristas' ? 'bg-coffee-600 text-white' : 'bg-white text-coffee-800 hover:bg-coffee-100'}`}
          onClick={() => setActiveTab('baristas')}
        >
          Baristas
        </button>
      </div>

      {/* Panel de gestión de menú */}
      {activeTab === 'menu' && (
        <>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-coffee-600 hover:bg-coffee-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Agregar Nuevo Producto
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-coffee-800 mb-4">
                  {editingItem ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </h2>
                <MenuItemForm
                  initialData={editingItem || undefined}
                  onSave={handleSaveItem}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          )}

          <div key={refreshKey}>
            <MenuView
              adminMode={true}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </>
      )}

      {/* Panel de gestión de pedidos */}
      {activeTab === 'pedidos' && (
        <div>
          <OrdersView />
        </div>
      )}

      {activeTab === 'baristas' && (
        <BaristasView />
      )}
    </div>
  );
};

export default AdminView; 