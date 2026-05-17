import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('usuario')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    getMe()
      .then((u) => setUsuario(u))
      .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('usuario'); })
      .finally(() => setLoading(false));
  }, []);

  const signIn = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const updateUsuario = (updates) => {
    const updated = { ...usuario, ...updates };
    localStorage.setItem('usuario', JSON.stringify(updated));
    setUsuario(updated);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, signIn, signOut, updateUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
