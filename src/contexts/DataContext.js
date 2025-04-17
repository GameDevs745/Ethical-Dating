import { createContext, useContext, useEffect, useState } from 'react';
import { initDB } from '../data/database';
import * as userRepo from '../data/userRepository';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDB().then(() => {
      setDbReady(true);
      // Load user from localStorage if exists
      const userId = localStorage.getItem('userId');
      if (userId) userRepo.getUser(userId).then(setCurrentUser);
    });
  }, []);

  const login = async (email, password) => {
    // Simple auth simulation
    const user = { id: email, email, name: email.split('@')[0] };
    await userRepo.saveUser(user);
    localStorage.setItem('userId', user.id);
    setCurrentUser(user);
  };

  const value = { currentUser, dbReady, login, /* other methods */ };
  
  return (
    <DataContext.Provider value={value}>
      {dbReady ? children : <div>Loading database...</div>}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);