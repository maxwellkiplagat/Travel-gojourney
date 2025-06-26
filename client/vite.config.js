// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { webcrypto } from 'crypto'

// Polyfill Web Crypto API on Node < 20
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto
}

export default defineConfig({
  plugins: [react()],
  server: {
    // If your Flask backend runs on 5555, proxy API calls:
    proxy: {
      '/api': {
        target: 'http://localhost:5555',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})