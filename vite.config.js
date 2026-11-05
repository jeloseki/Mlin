import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true // Ako je 5173 zauzet, javit će grešku umjesto da pređe na 5174
  }
})

