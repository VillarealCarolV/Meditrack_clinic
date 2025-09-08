import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../utils/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login with:', { email });
      const result = await authService.login(email, password);
      console.log('AuthContext: Login result:', result);
      
      if (result && result.success && result.user) {
        console.log('AuthContext: Setting user and returning success');
        // Create a new object to ensure state updates
        const userData = { ...result.user };
        setUser(userData);
        return { 
          success: true,
          role: userData.role,
          user: userData
        };
      }
      
      const errorMessage = result?.message || 'Login failed: Invalid response from server';
      console.error('AuthContext: Login failed:', errorMessage);
      throw new Error(errorMessage);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to log in. Please try again.');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // The actual navigation will be handled by the component using this context
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role
  };

  // Always render children, but pass loading state in the context
  return (
    <AuthContext.Provider value={{
      ...value,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
