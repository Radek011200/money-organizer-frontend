<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const newPasswordConfirmation = ref('');

const profileMessage = ref('');
const profileError = ref('');
const passwordMessage = ref('');
const passwordError = ref('');

const isProfileLoading = ref(false);
const isPasswordLoading = ref(false);

onMounted(async () => {
  if (authStore.user) {
    name.value = authStore.user.name;
    email.value = authStore.user.email;
  } else {
    await authStore.fetchUser();
    if (authStore.user) {
      name.value = authStore.user.name;
      email.value = authStore.user.email;
    }
  }
});

const updateProfile = async () => {
  if (!name.value || !email.value) {
    profileError.value = 'Name and email are required';
    return;
  }

  isProfileLoading.value = true;
  profileMessage.value = '';
  profileError.value = '';

  try {
    const user = await authStore.updateProfile({
      name: name.value,
      email: email.value
    });

    if (user) {
      profileMessage.value = 'Profile updated successfully';
    } else {
      profileError.value = authStore.error || 'Failed to update profile';
    }
  } catch (error) {
    profileError.value = 'An error occurred while updating profile';
    console.error('Profile update error:', error);
  } finally {
    isProfileLoading.value = false;
  }
};

const updatePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !newPasswordConfirmation.value) {
    passwordError.value = 'All password fields are required';
    return;
  }

  if (newPassword.value !== newPasswordConfirmation.value) {
    passwordError.value = 'New passwords do not match';
    return;
  }

  if (newPassword.value.length < 8) {
    passwordError.value = 'New password must be at least 8 characters long';
    return;
  }

  isPasswordLoading.value = true;
  passwordMessage.value = '';
  passwordError.value = '';

  try {
    const success = await authStore.updatePassword({
      current_password: currentPassword.value,
      password: newPassword.value,
      password_confirmation: newPasswordConfirmation.value
    });

    if (success) {
      passwordMessage.value = 'Password updated successfully';
      currentPassword.value = '';
      newPassword.value = '';
      newPasswordConfirmation.value = '';
    } else {
      passwordError.value = authStore.error || 'Failed to update password';
    }
  } catch (error) {
    passwordError.value = 'An error occurred while updating password';
    console.error('Password update error:', error);
  } finally {
    isPasswordLoading.value = false;
  }
};
</script>

<template>
  <div class="profile-container">
    <h1>User Profile</h1>

    <div class="profile-section">
      <h2>Profile Information</h2>

      <div v-if="profileMessage" class="success-message">
        {{ profileMessage }}
      </div>

      <div v-if="profileError" class="error-message">
        {{ profileError }}
      </div>

      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            :disabled="isProfileLoading"
          >
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :disabled="isProfileLoading"
          >
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isProfileLoading"
          >
            {{ isProfileLoading ? 'Updating...' : 'Update Profile' }}
          </button>
        </div>
      </form>
    </div>

    <div class="profile-section">
      <h2>Change Password</h2>

      <div v-if="passwordMessage" class="success-message">
        {{ passwordMessage }}
      </div>

      <div v-if="passwordError" class="error-message">
        {{ passwordError }}
      </div>

      <form @submit.prevent="updatePassword" class="password-form">
        <div class="form-group">
          <label for="current-password">Current Password</label>
          <input
            id="current-password"
            v-model="currentPassword"
            type="password"
            required
            :disabled="isPasswordLoading"
          >
        </div>

        <div class="form-group">
          <label for="new-password">New Password</label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            required
            :disabled="isPasswordLoading"
          >
        </div>

        <div class="form-group">
          <label for="new-password-confirmation">Confirm New Password</label>
          <input
            id="new-password-confirmation"
            v-model="newPasswordConfirmation"
            type="password"
            required
            :disabled="isPasswordLoading"
          >
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isPasswordLoading"
          >
            {{ isPasswordLoading ? 'Updating...' : 'Change Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.profile-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.25rem;
  color: #333;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.profile-form,
.password-form {
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
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}
</style>
