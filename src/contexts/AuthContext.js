import { createContext, useContext, useEffect, useState } from 'react';
import { fakeAuth } from '../data/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = fakeAuth.getCurrentUser();
    if (storedUser) fakeAuth.currentUser = storedUser;
    setUser(storedUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const user = await fakeAuth.login(email, password);
    setUser(user);
    return user;
  };

  const logout = () => {
    fakeAuth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);