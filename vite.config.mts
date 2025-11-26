import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Slicker',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'slicker.esm.js';
        if (format === 'umd') return 'slicker.js';
        return `slicker.${format}.js`;
      }
    },
    outDir: '.',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {},
        assetFileNames: 'slicker.css'
      }
    }
  },
  server: {
    open: '/index.html'
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  }
});
