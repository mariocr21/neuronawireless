import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Neurona Wireless',
      short_name: 'Neurona',
      description: 'Sistema de monitoreo agrícola',
      theme_color: '#0ba703',
      background_color: '#252625',
      display: 'standalone'
    }
  }), cloudflare()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://neuronawireless.com',
        changeOrigin: true,
        secure: false, // In case of self-signed SSL issues
        rewrite: (path) => path.replace(/^\/api/, '/platform/api')
      },
      '/app': {
        target: 'https://neuronawireless.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/app/, '/platform/app')
      },
      '/broadcasting': {
        target: 'https://neuronawireless.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/broadcasting/, '/platform/broadcasting')
      }
    }
  }
});