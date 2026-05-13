import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
    },
  },
});
