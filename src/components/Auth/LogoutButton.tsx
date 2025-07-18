import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
    >
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton; 