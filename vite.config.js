import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',   // Required for Capacitor — assets load via file:// on Android
  plugins: [
    react(),
    // Gzip compression for all assets — improves page load speed → Core Web Vitals → SEO
    viteCompression({ algorithm: 'gzip', ext: '.gz' }),
    // Brotli compression (even smaller — supported by all modern browsers)
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  build: {
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'motion': ['framer-motion'],
          'icons': ['lucide-react'],
        },
      },
    },
  },
})
