import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: '.vite/build',
    lib: {
      entry: resolve(__dirname, 'src/main/main.ts'),
      formats: ['cjs'],
      fileName: 'main'
    },
    rollupOptions: {
      external: ['electron'],
      output: {
        format: 'cjs',
        entryFileNames: '[name].cjs'
      }
    },
    minify: false
  }
});