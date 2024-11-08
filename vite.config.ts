import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Directorio de salida
    chunkSizeWarningLimit: 500, // Ajusta el límite de tamaño del chunk si es necesario
  },
});
