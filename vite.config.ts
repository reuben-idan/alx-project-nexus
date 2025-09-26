import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // Base URL for the application
    base: '/',
    
    // Development server configuration
    server: {
      port: 3000,
      open: true,
      // Proxy API requests to avoid CORS issues in development
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-tabs', '@radix-ui/react-slot', '@radix-ui/react-dropdown-menu'],
            animations: ['framer-motion'],
            state: ['@reduxjs/toolkit', 'react-redux'],
          },
        },
      },
    },
    
    // Resolve configuration for path aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@services': resolve(__dirname, 'src/services'),
        '@store': resolve(__dirname, 'src/store'),
      },
    },
    
    // Plugin configuration
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico', 
          'apple-touch-icon.png',
          'masked-icon.svg',
          'pwa-192x192.png',
          'pwa-512x512.png'
        ],
        manifest: {
          name: 'Everything Grocery',
          short_name: 'Grocery',
          description: 'Your one-stop shop for all grocery needs',
          theme_color: '#4f46e5',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            }
          ]
        },
      }),
      // Bundle analyzer - generates stats.html
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    
    // Preview server configuration
    preview: {
      port: 3000,
      open: true,
    },
  };
});
