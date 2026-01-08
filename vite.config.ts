import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    // Keep proxy for CORS but disable changeOrigin to preserve subdomain
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: false, // Keep original Host header to preserve subdomain
      },
    },
  },
});
