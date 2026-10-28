import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerCustomer, fetchCurrentProfile } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('es_auth_token'));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('es_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate and restore session on page mount / refresh
  const restoreSession = useCallback(async () => {
    const storedToken = localStorage.getItem('es_auth_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await fetchCurrentProfile();
      setUser(profile);
      localStorage.setItem('es_auth_user', JSON.stringify(profile));
    } catch (err) {
      // Token is expired or invalid
      console.warn('Session restoration failed:', err.message);
      localStorage.removeItem('es_auth_token');
      localStorage.removeItem('es_auth_user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    const { access_token, user: userData } = data;

    localStorage.setItem('es_auth_token', access_token);
    localStorage.setItem('es_auth_user', JSON.stringify(userData));
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const data = await registerCustomer(userData);
    const { access_token, user: newCustomer } = data;

    localStorage.setItem('es_auth_token', access_token);
    localStorage.setItem('es_auth_user', JSON.stringify(newCustomer));
    setToken(access_token);
    setUser(newCustomer);
    return newCustomer;
  };

  const logout = () => {
    localStorage.removeItem('es_auth_token');
    localStorage.removeItem('es_auth_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('es_auth_user', JSON.stringify(updatedUser));
  };

  const value = {
    token,
    user,
    isAuthenticated: !!user,
    isAdmin: !!(user && user.is_admin),
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
