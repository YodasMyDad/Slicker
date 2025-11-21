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
      name: 'Slick',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'slick.esm.js';
        if (format === 'umd') return 'slick.js';
        return `slick.${format}.js`;
      }
    },
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {}
      }
    }
  },
  server: {
    open: '/index.html'
  }
});

