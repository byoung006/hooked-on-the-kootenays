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
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
