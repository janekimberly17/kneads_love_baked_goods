import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves this project at https://<user>.github.io/<repo>/,
  // so every asset URL needs the repo name as its base path.
  // If you move to a custom domain later, change this to '/'.
  base: '/kneads_love_baked_goods/',
})
