import { initDB } from './localDatabase';

export const userService = {
  async saveUser(user) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readwrite');
      const store = tx.objectStore('users');
      store.put(user);
      tx.oncomplete = () => resolve();
      tx.onerror = (event) => reject(event.target.error);
    });
  },

  async getUser(userId) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readonly');
      const store = tx.objectStore('users');
      const request = store.get(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async getAllUsers() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readonly');
      const store = tx.objectStore('users');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }
};