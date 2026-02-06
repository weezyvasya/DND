import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: './',
  root: resolve(__dirname, 'src/renderer/main_window'),
  build: {
    outDir: resolve(__dirname, '.vite/build/renderer/main_window'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/renderer/main_window/index.html')
      }
    }
  },
  server: {
    port: 5173
  }
});