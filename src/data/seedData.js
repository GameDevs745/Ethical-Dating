
import { userService } from './userService';
export const seedInitialUsers = async () => {
  const existing = await userService.getAllUsers();
  if (existing.length === 0) {
    await userService.saveUser({
      id: 'demo1',
      name: 'Alice',
      email: 'alice@example.com',
      gender: 'female',
      preference: 'male',
      age: 25,
      photoURL: '/default-profile.jpg'
    });
    
    await userService.saveUser({
      id: 'demo2',
      name: 'Bob',
      email: 'bob@example.com',
      gender: 'male',
      preference: 'female',
      age: 28,
      photoURL: '/default-profile.jpg'
    });
  }
};

// Call in index.js before render