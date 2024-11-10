import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    esbuild: {
      pure: isProd ? ['console.log'] : [],
    },
    // logLevel: mode === 'production' ? 'silent' : 'warn',
    // clearScreen: mode === 'production',
    plugins: [ react() ],
    css: {
      preprocessorOptions: {
        scss: {  },
      },
    },
    build: {
      assetsDir: '', // Place all assets in root
      assetsInlineLimit: 2048, // Smaller resources will be embedded as base64
      sourcemap: !isProd,
      outDir: '../backend/public',
      // emptyOutDir: false, // avoid vite build deleting content of outDir
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          auth: resolve(__dirname, './auth/index.html'),
        },
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'libs';
            } else if (id.includes('node_modules')) {
              return 'auth';
            }
          },
        },
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@API': path.resolve(__dirname, './api'),
        '@Commn': path.resolve(__dirname, './commons'),
        '@Store': path.resolve(__dirname, './store'),
      },
    },
    define: {
      '__DETAILED_ERR__': 'true',
    },
  }
})
