import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/rc-match-ai/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
