import axios from 'axios';

// Create a separate axios instance for CSRF token fetching
// This instance doesn't need the CSRF token itself
const csrfClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getCsrfToken() {
    return csrfClient.get('/sanctum/csrf-cookie');
  }
};
