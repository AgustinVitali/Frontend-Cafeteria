import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const passwordRequirements = [
  {
    label: 'Al menos 8 caracteres',
    test: (pw: string) => pw.length >= 8,
  },
  {
    label: 'Al menos 3 de los siguientes:',
    test: (pw: string) => {
      let count = 0;
      if (/[a-z]/.test(pw)) count++;
      if (/[A-Z]/.test(pw)) count++;
      if (/[0-9]/.test(pw)) count++;
      if (/[^a-zA-Z0-9]/.test(pw)) count++;
      return count >= 3;
    },
  },
];

const BaristasView: React.FC = () => {
  const { getAccessToken } = useAuth();
  const [baristas, setBaristas] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validations, setValidations] = useState([false, false]);

  useEffect(() => {
    const fetchBaristas = async () => {
      try {
        const token = await getAccessToken();
        const data = await apiService.getBaristas(token);
        setBaristas(data);
      } catch (err) {
        setError('Error al cargar baristas');
      }
    };
    fetchBaristas();
  }, [getAccessToken]);

  useEffect(() => {
    setValidations([
      passwordRequirements[0].test(password),
      passwordRequirements[1].test(password),
    ]);
  }, [password]);

  const validateEmail = (email: string) => /.+@.+\..+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!validateEmail(email)) {
      setError('El correo electrónico no es válido.');
      setLoading(false);
      return;
    }
    if (!validations.every(Boolean)) {
      setError('La contraseña no cumple los requisitos.');
      setLoading(false);
      return;
    }
    try {
      const token = await getAccessToken();
      const nuevo = await apiService.createBarista(email, password, token);
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
              {email && !validateEmail(email) && (
                <p className="text-xs text-red-600 mt-1">Correo inválido</p>
              )}
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
              <ul className="text-xs mt-2 space-y-1">
                <li className={validations[0] ? 'text-green-600' : 'text-red-600'}>• Al menos 8 caracteres</li>
                <li className={validations[1] ? 'text-green-600' : 'text-red-600'}>
                  • Al menos 3 de los siguientes:
                  <ul className="ml-4">
                    <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>• Minúsculas (a-z)</li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>• Mayúsculas (A-Z)</li>
                    <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>• Números (0-9)</li>
                    <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>• Caracteres especiales (e.g. !@#$%^&*)</li>
                  </ul>
                </li>
              </ul>
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