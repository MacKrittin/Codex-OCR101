import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  publicDir: 'node_modules/pdfjs-dist/wasm',
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', globals: true, exclude: ['node_modules/**', '.worktrees/**'] },
});
