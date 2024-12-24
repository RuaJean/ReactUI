import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // { id, nombre, rol, ... }
  const [token, setToken] = useState(null); // JWT
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      // GET /api/auth/me  -> { id, rol, [otros] }
      const res = await axiosClient.get('/api/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error al obtener perfil:', err);
      logout();
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      getProfile().finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // /api/auth/login -> { token }
      const res = await axiosClient.post('/api/auth/login', { email, password });
      const { token } = res.data;
      // Guardamos en localStorage
      localStorage.setItem('token', token);
      setToken(token);
      // Obtenemos el perfil
      await getProfile();
      setLoading(false);
    } catch (err) {
      console.error('Error en login:', err);
      throw err; // para que el componente capture el error
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
