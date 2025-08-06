import apiClient from './axios';

export default {
  // Get the current authenticated user
  getUser() {
    return apiClient.get('/api/user');
  },

  // Login with email and password
  login(credentials) {
    return apiClient.post('/login', credentials);
  },

  // Register a new user
  register(user) {
    return apiClient.post('/register', user);
  },

  // Logout the current user
  logout() {
    return apiClient.post('/logout');
  },

  // Update user profile
  updateProfile(userData) {
    return apiClient.put('/api/user/profile', userData);
  },

  // Update user password
  updatePassword(passwordData) {
    return apiClient.put('/api/user/password', passwordData);
  },

  // Get Google OAuth URL
  getGoogleAuthUrl() {
    return `${import.meta.env.VITE_API_URL}/auth/google`;
  }
};
