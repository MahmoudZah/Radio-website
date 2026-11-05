import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves a project site from https://<user>.github.io/<repo>/
// so assets must be requested relative to that sub-path.
//
// Default: './'  (relative paths: works on any repo name and on a custom domain)
// Override: VITE_BASE=/your-repo-name/ npm run build   (absolute sub-path, also fine)
export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [react()],
  // three.js is its own lazily loaded chunk (only fetched for the 3D scenes)
  build: { chunkSizeWarningLimit: 800 },
})
