import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: [
      'restarter-signaling-server-1.onrender.com'
    ]
  }
}); 