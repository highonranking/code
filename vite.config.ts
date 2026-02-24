import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  appType: 'spa',
  plugins: [react()],
  server: {
    middlewareMode: false,
    proxy: {
      '^/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '^/share/': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
