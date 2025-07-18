import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import LogoutButton from '../Auth/LogoutButton';

const Header: React.FC = () => {
  const { isAuthenticated, user, hasRole } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path ? 'bg-coffee-600 text-white' : 'text-coffee-600 hover:bg-coffee-100';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-coffee-800">
            ☕ Cafetería Online
          </Link>

          {isAuthenticated && (
            <nav className="flex items-center space-x-4">
              <Link
                href="/menu"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/menu')}`}
              >
                Menú
              </Link>

              {hasRole('cliente') && (
                <Link
                  href="/mis-pedidos"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/mis-pedidos')}`}
                >
                  Mis Pedidos
                </Link>
              )}

              {hasRole('barista') && (
                <Link
                  href="/pedidos"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/pedidos')}`}
                >
                  Todos los Pedidos
                </Link>
              )}

              {hasRole('admin') && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin')}`}
                >
                  Administración
                </Link>
              )}

              <div className="flex items-center space-x-4 ml-4 border-l border-coffee-200 pl-4">
                <span className="text-sm text-coffee-600">
                  Hola, {user?.name}
                </span>
                <LogoutButton />
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 