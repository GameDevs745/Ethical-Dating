const DB_NAME = 'DatingAppDB';
const DB_VERSION = 2;
const STORES = {
  USERS: 'users',
  SWIPES: 'swipes',
  MATCHES: 'matches'
};

export const initDB = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    
    if (!db.objectStoreNames.contains(STORES.USERS)) {
      const usersStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
      usersStore.createIndex('gender', 'gender', { unique: false });
      usersStore.createIndex('preference', 'preference', { unique: false });
    }

    if (!db.objectStoreNames.contains(STORES.SWIPES)) {
      const swipesStore = db.createObjectStore(STORES.SWIPES, { keyPath: 'id' });
      swipesStore.createIndex('swiper', 'swiper', { unique: false });
    }

    if (!db.objectStoreNames.contains(STORES.MATCHES)) {
      db.createObjectStore(STORES.MATCHES, { keyPath: 'id' });
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = (event) => reject(event.target.error);
});