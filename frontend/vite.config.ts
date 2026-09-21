import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/internal/solicitudes': 'http://localhost:8081',
      '/internal/catalogo': 'http://localhost:8082',
    },
  },
})