import { defineStore } from 'pinia';
import AuthService from '@/services/AuthService';
import CsrfService from '@/services/CsrfService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userFullName: (state) => state.user ? state.user.name : '',
    userAvatar: (state) => state.user ? state.user.avatar : null
  },

  actions: {
    async fetchUser() {
      this.loading = true;
      this.error = null;

      try {
        const response = await AuthService.getUser();
        this.user = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch user';
        this.user = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        // First, fetch the CSRF token
        await CsrfService.getCsrfToken();

        // Then, make the login request
        await AuthService.login(credentials);
        return await this.fetchUser();
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || 'Login failed';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        // First, fetch the CSRF token
        await CsrfService.getCsrfToken();

        // Then, make the registration request
        await AuthService.register(userData);
        return await this.fetchUser();
      } catch (error) {
        console.error('Registration error:', error);
        this.error = error.response?.data?.message || 'Registration failed';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      this.error = null;

      try {
        // First, fetch the CSRF token
        await CsrfService.getCsrfToken();

        // Then, make the logout request
        await AuthService.logout();
        this.user = null;
        return true;
      } catch (error) {
        console.error('Logout error:', error);
        this.error = error.response?.data?.message || 'Logout failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(userData) {
      this.loading = true;
      this.error = null;

      try {
        // First, fetch the CSRF token
        await CsrfService.getCsrfToken();

        // Then, make the update profile request
        const response = await AuthService.updateProfile(userData);
        this.user = response.data.user;
        return response.data.user;
      } catch (error) {
        console.error('Update profile error:', error);
        this.error = error.response?.data?.message || 'Failed to update profile';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updatePassword(passwordData) {
      this.loading = true;
      this.error = null;

      try {
        // First, fetch the CSRF token
        await CsrfService.getCsrfToken();

        // Then, make the update password request
        await AuthService.updatePassword(passwordData);
        return true;
      } catch (error) {
        console.error('Update password error:', error);
        this.error = error.response?.data?.message || 'Failed to update password';
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});
