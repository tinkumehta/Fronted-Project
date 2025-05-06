import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from "../utlils/config.js"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const api = axios.create({ baseURL: config.envUrl });
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const register = (username, password) => api.post('/auth/register', { username, password });
  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    setToken(res.data.token);
  };
  const logout = async () => { await api.post('/auth/logout'); setToken(''); setUser(null); };
  const changePassword = async (oldPassword, newPassword) => { await api.post('/auth/change-password', { oldPassword, newPassword }); logout(); };

  return (
    <AuthContext.Provider value={{ token, user, register, login, logout, changePassword, api }}>
      {children}
    </AuthContext.Provider>
  );
};