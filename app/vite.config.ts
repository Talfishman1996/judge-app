import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages uses root path - no base needed
  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 5173,
    // Proxy API calls to wrangler during development
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true
      }
    }
  }
})
