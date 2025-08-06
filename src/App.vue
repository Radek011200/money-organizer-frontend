<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  try {
    await authStore.fetchUser()
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }
})

const logout = async () => {
  try {
    await authStore.logout()
    // Redirect to login page after logout
    window.location.href = '/login'
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="app-title">Money Organiser</div>
      <nav class="app-nav">
        <RouterLink to="/dashboard" class="nav-link">Strona główna</RouterLink>
        <RouterLink to="/statistics" class="nav-link">Statystyki</RouterLink>
        <RouterLink to="/expenses" class="nav-link">Wydatki</RouterLink>
        <RouterLink to="/deposits" class="nav-link">Wpłaty</RouterLink>
        <RouterLink to="/categories" class="nav-link">Kategorie</RouterLink>

        <!-- Authentication Links -->
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/profile" class="nav-link">
            {{ authStore.userFullName || 'Profile' }}
          </RouterLink>
          <a href="#" @click.prevent="logout" class="nav-link">Logout</a>
        </template>
        <template v-else>
          <RouterLink to="/login" class="nav-link">Login</RouterLink>
          <RouterLink to="/register" class="nav-link">Register</RouterLink>
        </template>
      </nav>
    </header>

    <main class="app-content">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} Money Organiser</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #3498db;
  color: white;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
}

.app-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
  font-size: 0.9rem;
}

.nav-link:after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: white;
  transition: width 0.3s;
}

.nav-link:hover:after,
.router-link-active:after {
  width: 100%;
}

.app-content {
  flex: 1;
  padding: 0.75rem;
}

.app-footer {
  background-color: #f5f5f5;
  padding: 0.75rem;
  text-align: center;
  font-size: 0.8rem;
  color: #666;
}

/* Tablet */
@media (min-width: 768px) {
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
  }

  .app-title {
    margin-bottom: 0;
    font-size: 1.5rem;
    text-align: left;
  }

  .app-nav {
    justify-content: flex-end;
  }

  .nav-link {
    font-size: 1rem;
  }

  .app-content {
    padding: 1.5rem;
  }

  .app-footer {
    padding: 1rem;
    font-size: 0.875rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .app-header {
    padding: 1rem 2rem;
  }

  .app-title {
    font-size: 1.75rem;
  }

  .app-content {
    padding: 2rem;
  }
}
</style>
