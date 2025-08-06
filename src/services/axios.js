import axios from 'axios';

// Create a custom Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the CSRF token in the headers
axiosInstance.interceptors.request.use(
  config => {
    // Get the XSRF-TOKEN cookie
    const xsrfToken = getCookie('XSRF-TOKEN');

    // If the cookie exists, add it to the headers
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Helper function to get a cookie by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? match[3] : null;
}

export default axiosInstance;
