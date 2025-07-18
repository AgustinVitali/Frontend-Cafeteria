import React from 'react';
import { useAuth } from '../src/hooks/useAuth';
import Header from '../src/components/Layout/Header';
import MenuView from '../src/components/Menu/MenuView';

export default function MenuPage() {
    const { isAuthenticated, isLoading } = useAuth();

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

    return (
        <div className="min-h-screen bg-coffee-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <MenuView />
            </main>
        </div>
    );
} 