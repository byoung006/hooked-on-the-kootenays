import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  build: {
    rollupOptions: {
      external: ['./server/'] // Adjust the path to your server directory
    }
  },
  define: {
    'process.env': {
      GCP_SERVICE_ACCOUNT_EMAIL: JSON.stringify(process.env.GCP_SERVICE_ACCOUNT_EMAIL),
      GCP_PRIVATE_KEY: JSON.stringify(process.env.GCP_PRIVATE_KEY),
      GCP_PROJECT_ID: JSON.stringify(process.env.GCP_PROJECT_ID),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://hooked-on-the-koots-backend.vercel.app',
        changeOrigin: true,
      }
    }
  }
})
