import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La surface est servie par Archon.Web sous /app ; le build atterrit dans wwwroot/app
// (commite, pour que l'utilisateur lance avec `dotnet run` sans Node).
// En dev (`npm run dev`), /api est relaye vers le coeur .NET (http://localhost:5240).
export default defineConfig({
  plugins: [react()],
  base: '/app/',
  build: {
    outDir: '../Archon.Web/wwwroot/app',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5240',
    },
  },
});
