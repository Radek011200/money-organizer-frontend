import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import LandingView from '../views/LandingView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/dashboard',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
      meta: { requiresAuth: true }
    },
    // Expense routes
    {
      path: '/expenses',
      name: 'expenses',
      component: () => import('../views/ExpenseListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/expenses/create',
      name: 'expense-create',
      component: () => import('../views/ExpenseFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/expenses/:id',
      name: 'expense-details',
      component: () => import('../views/ExpenseDetailsView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/expenses/:id/edit',
      name: 'expense-edit',
      component: () => import('../views/ExpenseFormView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    // Category routes
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/categories/create',
      name: 'category-create',
      component: () => import('../views/CategoryFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/categories/:id',
      name: 'category-details',
      component: () => import('../views/CategoryDetailsView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/categories/:id/edit',
      name: 'category-edit',
      component: () => import('../views/CategoryFormView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    // Deposit routes
    {
      path: '/deposits',
      name: 'deposits',
      component: () => import('../views/DepositListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/deposits/create',
      name: 'deposit-create',
      component: () => import('../views/DepositFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/deposits/:id',
      name: 'deposit-details',
      component: () => import('../views/DepositDetailsView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/deposits/:id/edit',
      name: 'deposit-edit',
      component: () => import('../views/DepositFormView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    // Authentication routes
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Try to fetch the user in case the store is not initialized yet
  if (!authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  // If the route requires authentication and user is not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // If the route requires guest (non-authenticated) and user is authenticated
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }

  // If user is authenticated and trying to access the landing page, redirect to dashboard
  if (to.name === 'landing' && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }

  next()
})

export default router
