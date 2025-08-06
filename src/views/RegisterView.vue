<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthService from '@/services/AuthService';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const register = async () => {
  // Basic validation
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const user = await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    });

    if (user) {
      router.push('/dashboard');
    } else {
      errorMessage.value = authStore.error || 'Registration failed. Please try again.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during registration. Please try again.';
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};

const loginWithGoogle = () => {
  window.location.href = AuthService.getGoogleAuthUrl();
};
</script>

<template>
  <div class="register-container">
    <h1>Register</h1>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="Enter your name"
          :disabled="isLoading"
        >
      </div>

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

      <div class="form-group">
        <label for="password-confirmation">Confirm Password</label>
        <input
          id="password-confirmation"
          v-model="passwordConfirmation"
          type="password"
          required
          placeholder="Confirm your password"
          :disabled="isLoading"
        >
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
      </div>
    </form>

    <div class="social-login">
      <p>Or register with:</p>
      <button
        @click="loginWithGoogle"
        class="btn btn-google"
        :disabled="isLoading"
      >
        Google
      </button>
    </div>

    <div class="login-link">
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
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

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: 500;
}

input[type="text"],
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

.login-link {
  margin-top: 20px;
  text-align: center;
}

.login-link a {
  color: #3498db;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
