import { initDB } from './localDatabase';

export const swipeService = {
  async addSwipe(swipe) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('swipes', 'readwrite');
      const store = tx.objectStore('swipes');
      store.put(swipe);
      tx.oncomplete = resolve;
      tx.onerror = (event) => reject(event.target.error);
    });
  },

  async getSwipesByUser(userId) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('swipes', 'readonly');
      const store = tx.objectStore('swipes');
      const index = store.index('swiperId');
      const request = index.getAll(userId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async checkForMatch(userId, swipeeId) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('swipes', 'readonly');
      const store = tx.objectStore('swipes');
      const theirSwipeId = `${swipeeId}_${userId}`;
      
      const request = store.get(theirSwipeId);
      
      request.onsuccess = () => {
        resolve(request.result?.direction === 'right');
      };
      
      request.onerror = (event) => reject(event.target.error);
    });
  }
};