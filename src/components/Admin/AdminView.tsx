import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import { MenuItem } from '../../types';
import MenuView from '../Menu/MenuView';
import MenuItemForm from './MenuItemForm';

const AdminView: React.FC = () => {
  const { getAccessToken } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
          Gestiona los productos del menú de la cafetería
        </p>
      </div>

      <div className="flex justify-center">
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
    </div>
  );
};

export default AdminView; 