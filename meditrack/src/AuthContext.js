import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, load user from localStorage (for dev/demo)
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Save user to localStorage when it changes (for dev/demo)
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // For development/testing only
  const loginAsRole = (role) => {
    const user = { name: role + ' (dev)', role, email: `${role}@example.com` };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'dev-token');
  };

  const logout = () => {
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/login';
};

  return (
    <AuthContext.Provider value={{ user, login, loginAsRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
