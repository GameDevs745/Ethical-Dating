const FAKE_DELAY = 500; // Simulate API delay

export const fakeAuth = {
  currentUser: null,

  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
    const user = {
      id: btoa(email),
      email,
      name: email.split('@')[0],
      createdAt: new Date()
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
    return user;
  },

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
};