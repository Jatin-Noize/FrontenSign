import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // In AuthContext.jsx, add error handling:
useEffect(() => {
  async function loadUser() {
    try {
      const { data } = await axios.get('/api/user', {
        withCredentials: true
      });
      setUser(data);
    } catch (err) {
      console.error('Auth check failed:', err.response?.data || err.message);
      setUser(null);
      // Redirect if not on login/register
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  }
  loadUser();
}, []);

  const register = async (email, password) => {
    const response = await axios.post('/api/auth/register', { email, password });
    setUser(response.data.user);
    navigate('/dashboard');
  };

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
    setUser(response.data.user);
    navigate('/dashboard');
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}