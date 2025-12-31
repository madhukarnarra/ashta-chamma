import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load from relative paths
  server: {
    host: true // Exposes IP for checking on real devices if needed
  }
})
