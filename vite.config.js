import { defineConfig } from 'vite'
import { resolve } from 'path'

// Configuración de Vite para la landing de Snap Solutions.
// El sitio es estático: `npm run build` genera la carpeta `dist/`
// que luego se sirve con Nginx en el VPS.
export default defineConfig({
  // base: '/'  ->  dejalo así si el sitio vive en la raíz del dominio (snapsolutions.io)
  base: '/',
  server: {
    port: 5173,
    open: true
  },
  preview: {
    // Allow Cloudflare quick tunnels (*.trycloudflare.com) to reach the preview
    // server for temporary sharing. Vite blocks unknown hosts by default.
    allowedHosts: ['.trycloudflare.com']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Varias páginas: la home y /soluciones (productos)
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        soluciones: resolve(__dirname, 'soluciones.html'),
        en: resolve(__dirname, 'en/index.html'),
        en_soluciones: resolve(__dirname, 'en/soluciones.html'),
        pt: resolve(__dirname, 'pt/index.html'),
        pt_soluciones: resolve(__dirname, 'pt/soluciones.html')
      }
    }
  }
})
