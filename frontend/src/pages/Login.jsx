import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Failed to login');
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-900">
    
      <div className="max-w-md w-full space-y-8 p-8 bg-black bg-opacity-30 backdrop-blur-sm rounded-lg shadow-lg border border-purple-500/20">
        <h2 className="text-2xl uppercase font-medium text-center text-white">𝒮𝒾𝑔𝓃 𝒾𝓃 𝓉𝑜 𝓎𝑜𝓊𝓇 𝒶𝒸𝒸𝑜𝓊𝓃𝓉</h2>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-200">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-purple-500/30 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-black/30 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-purple-500/30 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-black/30 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-purple-200">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}