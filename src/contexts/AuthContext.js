// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { fakeAuth } from '../data/authService';
import { initDB } from '../data/localDatabase';
import { userService } from '../data/userService';
import { seedInitialUsers } from '../data/seedData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize database and auth state
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize database
        await initDB();
        setDbReady(true);
        
        // Seed initial data if needed
        await seedInitialUsers();

        // Check existing auth
        const storedUser = fakeAuth.getCurrentUser();
        if (storedUser) {
          // Verify user exists in database
          const dbUser = await userService.getUser(storedUser.id);
          if (dbUser) {
            fakeAuth.currentUser = dbUser;
            setUser(dbUser);
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const login = async (email, password) => {
  try {
    if (!dbReady) throw new Error('Database not ready')
      // Create/authenticate user
      const authUser = await fakeAuth.login(email, password);
      
      // Save/update user in database
      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.name,
        createdAt: new Date()
      };
      await userService.saveUser(userData);
      
      // Get full user record
      const dbUser = await userService.getUser(authUser.id);
      setUser(dbUser);
      
      return dbUser;
   } catch (error) {
    setError(error.message);
    throw error;
  }
};

  const logout = () => {
    fakeAuth.logout();
    setUser(null);
    window.location.reload();
  };

  const value = {
    user,
    loading,
    dbReady,
    login,
    logout,
    getCurrentUser: () => fakeAuth.getCurrentUser(),
    error,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};