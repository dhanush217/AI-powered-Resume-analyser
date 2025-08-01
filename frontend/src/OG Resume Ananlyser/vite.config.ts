import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from '@tailwindcss/postcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcss(),
      ],
    },
  },
})
