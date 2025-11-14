// myproject-frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Adjust if using Vue/Svelte

export default defineConfig({
  plugins: [react()],
  base: '/static/', // Ensure assets are prefixed with /static/
  build: {
    outDir: 'dist',
  },
});