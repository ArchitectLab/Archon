import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Archon EST le produit : la surface est servie a la racine "/" par Archon.Web, et ses assets
// vivent sous /archon/. Le build atterrit dans wwwroot/archon (commite, lancement sans Node).
// En dev (`npm run dev`), /api est relaye vers le coeur .NET (http://localhost:5240).
export default defineConfig({
  plugins: [react()],
  base: '/archon/',
  build: {
    outDir: '../Archon.Web/wwwroot/archon',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5240',
    },
  },
});
