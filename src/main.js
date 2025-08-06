import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import CsrfService from './services/CsrfService'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Fetch CSRF token before mounting the app
CsrfService.getCsrfToken()
  .then(() => {
    app.mount('#app')
  })
  .catch(error => {
    console.error('Failed to fetch CSRF token:', error)
    // Mount the app anyway to avoid blocking the application
    app.mount('#app')
  })
