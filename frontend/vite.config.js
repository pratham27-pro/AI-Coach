import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/', 
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // Proxy API calls during development
      '/api': {
        target: 'http://localhost:5000', // Local backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
