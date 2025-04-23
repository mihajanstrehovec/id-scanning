import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./192.168.1.136+2-key.pem'),
      cert: fs.readFileSync('./192.168.1.136+2.pem'),
    },
    host: '0.0.0.0', // exposes to local network
    port: 5173,
  }
})