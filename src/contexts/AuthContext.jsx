import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't auto-load auth data to prevent redirects
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await apiService.auth.login(credentials);
    const userData = {
      id: response.id,
      fullName: response.fullName,
      email: response.email,
      role: response.role
    };
    
    setUser(userData);
    setToken(response.token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', response.token);
    apiService.setAuthToken(response.token);
    
    return response;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    apiService.setAuthToken(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };