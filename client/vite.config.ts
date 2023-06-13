import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/data': {
        target: 'http://localhost:3001',
        secure: false,
        rewrite: (path) => path.replace(/^\/data/, ''),
      }
    },
    host: true
  },
  plugins: [react()],
});
