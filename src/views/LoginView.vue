<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthService from '@/services/AuthService';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const user = await authStore.login({
      email: email.value,
      password: password.value,
      remember: rememberMe.value
    });

    if (user) {
      router.push('/dashboard');
    } else {
      errorMessage.value = authStore.error || 'Login failed. Please try again.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login. Please try again.';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

const loginWithGoogle = () => {
  window.location.href = AuthService.getGoogleAuthUrl();
};
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="Enter your email"
          :disabled="isLoading"
        >
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="Enter your password"
          :disabled="isLoading"
        >
      </div>

      <div class="form-group checkbox">
        <input
          id="remember-me"
          v-model="rememberMe"
          type="checkbox"
          :disabled="isLoading"
        >
        <label for="remember-me">Remember me</label>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </form>

    <div class="social-login">
      <p>Or login with:</p>
      <button
        @click="loginWithGoogle"
        class="btn btn-google"
        :disabled="isLoading"
      >
        Google
      </button>
    </div>

    <div class="register-link">
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

label {
  margin-bottom: 5px;
  font-weight: 500;
}

input[type="email"],
input[type="password"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  margin-top: 10px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.social-login {
  margin-top: 20px;
  text-align: center;
}

.btn-google {
  background-color: #db4437;
  color: white;
  padding: 10px 20px;
}

.btn-google:hover:not(:disabled) {
  background-color: #c53929;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
