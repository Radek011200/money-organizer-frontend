import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Otwiera Vite na wszystkich interfejsach
    port: 5173, // Port zgodny z `docker-compose.yml`
    strictPort: true, // Jeśli port jest zajęty, nie przełącza na inny
    watch: {
      usePolling: true // Użyteczne w środowiskach Docker/WSL
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
