import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // host: true agar dev server bisa diakses dari luar container
    host: true,
    port: 3001,
    // Polling wajib aktif agar Hot Reload jalan mulus di Docker (bind mount Linux)
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
});
