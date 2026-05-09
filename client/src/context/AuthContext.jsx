import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (firebaseUid, phone, name, role) => {
    try {
      const { data } = await api.post('/auth/verify', { firebaseUid, phone, name, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const loginVendor = async (emailOrPhone, password) => {
    try {
      const { data } = await api.post('/auth/vendor/login', { emailOrPhone, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signupVendor = async (vendorData) => {
    try {
      const { data } = await api.post('/auth/vendor/signup', vendorData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginVendor, signupVendor, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
