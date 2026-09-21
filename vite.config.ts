import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cambiá esto por el nombre de tu repo si lo deployás en GitHub Pages
  // (ej: '/armario-virtual/'). Dejalo en '/' si usás Netlify.
  base: '/armario-virtual/',
})
