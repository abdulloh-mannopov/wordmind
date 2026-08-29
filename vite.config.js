import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use relative base for production so assets load inside Tauri bundle
  base: command === 'serve' ? '/' : './',
  // Avoid watching Rust build artifacts under src-tauri/target which can be locked
  server: {
    watch: {
      ignored: ['**/src-tauri/target/**']
    }
  },
  build: {
    target: 'es2020',
  },
}))
