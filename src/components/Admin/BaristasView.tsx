import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { User } from '../../types';

//HARDCODEOOOOOOOOOOO NO PUEDO TOCAR EL BACKEND
const DUMMY_BARISTAS: User[] = [
  { id: '1', email: 'barista1@cafe.com', name: 'Barista Uno', roles: ['barista'] },
  { id: '2', email: 'barista2@cafe.com', name: 'Barista Dos', roles: ['barista'] },
];

const BaristasView: React.FC = () => {
  const [baristas, setBaristas] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Simular fetch de baristas
    setBaristas(DUMMY_BARISTAS);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Simular creación de barista
      const nuevo = {
        id: (Math.random() * 100000).toFixed(0),
        email,
        name: email.split('@')[0],
        roles: ['barista'],
      };
      setBaristas(prev => [...prev, nuevo]);
      setSuccess('¡Barista creado exitosamente!');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Error al crear barista');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-coffee-800 mb-2">Baristas</h2>
        <p className="text-coffee-600">Lista de usuarios con rol barista</p>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0 items-start justify-center">
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full bg-white border border-coffee-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Correo</th>
                <th className="px-4 py-2 border-b">Nombre</th>
              </tr>
            </thead>
            <tbody>
              {baristas.map((barista) => (
                <tr key={barista.id}>
                  <td className="px-4 py-2 border-b">{barista.email}</td>
                  <td className="px-4 py-2 border-b">{barista.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-1 max-w-md w-full bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Crear nuevo barista</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-coffee-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-coffee-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-coffee-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-coffee-300 rounded px-3 py-2"
              />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
            <button
              type="submit"
              className="bg-coffee-600 hover:bg-coffee-700 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Barista'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BaristasView; 