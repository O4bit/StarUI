import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (err) {
          console.error('Auth token validation failed:', err);
          localStorage.removeItem('authToken');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);
  

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      

      localStorage.setItem('authToken', token);
      

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      

      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      

      navigate('/');
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  

  const logout = async () => {
    try {

      if (user) {
        await api.post('/auth/logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {

      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login');
    }
  };
  
  const hasRole = (role) => {
    return user && user.roles && user.roles.includes(role);
  };
  
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};