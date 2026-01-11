import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true, // Listen on all network interfaces
    // Allow subdomain access (admin.spice.localhost:5175)
    allowedHosts: [
      '.localhost', // Allow all *.localhost subdomains
      '.yourdomain.com', // Replace with your production domain
    ],
    // Keep proxy for CORS but preserve subdomain in Host header
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: false, // Preserve subdomain (admin.spice.localhost)
        ws: true, // Support WebSocket (Socket.IO)
      },
    },
  },
});
