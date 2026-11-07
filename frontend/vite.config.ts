import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo, /v1 y /v2 se reenvían al BFF (evita problemas de CORS).
// En producción el frontend llama a AWS API Gateway (VITE_API_BASE_URL).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/v1': 'http://localhost:8080',
      '/v2': 'http://localhost:8080',
    },
  },
})
