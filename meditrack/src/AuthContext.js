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

  const loginAsRole = (role) => {
    // For dev, just set user object with role
    setUser({ name: role + ' (dev)', role });
  };

  const logout = () => {
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/login';
};

  return (
    <AuthContext.Provider value={{ user, loginAsRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
