import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginButton: React.FC = () => {
  const { login } = useAuth();

  return (
    <button
      onClick={login}
      className="bg-coffee-600 hover:bg-coffee-700 text-white font-bold py-2 px-4 rounded transition-colors"
    >
      Iniciar Sesión
    </button>
  );
};

export default LoginButton; 