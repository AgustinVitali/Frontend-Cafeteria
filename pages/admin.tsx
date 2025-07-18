import React from 'react';
import { useAuth } from '../src/hooks/useAuth';
import Header from '../src/components/Layout/Header';
import AdminView from '../src/components/Admin/AdminView';
import { useRouter } from 'next/router';

export default function AdminPage() {
    const { isAuthenticated, isLoading, hasRole } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-coffee-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
                    <p className="mt-4 text-coffee-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push('/');
        return null;
    }

    if (!hasRole('admin')) {
        return (
            <div className="min-h-screen bg-coffee-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                        <p className="text-coffee-600">No tienes permisos para acceder a esta página.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-coffee-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <AdminView />
            </main>
        </div>
    );
} 