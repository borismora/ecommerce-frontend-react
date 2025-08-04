import { useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const performLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  const performLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, performLogin, performLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
