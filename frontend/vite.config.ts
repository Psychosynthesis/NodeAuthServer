import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  console.log('path.resolve: ', path.resolve(__dirname, './store'),)
  return {
    esbuild: {
      pure: isProd ? ['console.log'] : [],
    },
    // logLevel: mode === 'production' ? 'silent' : 'warn',
    // clearScreen: mode === 'production',
    server: { port: 5000, }, // To easiest remembering
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
          main: path.resolve(__dirname, 'index.html'),
          auth: path.resolve(__dirname, './auth/index.html'),
        },
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'libs';
            } else if (id.includes('auth')) {
              return 'auth';
            }
          },
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@API': path.resolve(__dirname, './api'),
        '@Commn': path.resolve(__dirname, './commons'),
        '@Config': path.resolve(__dirname, '../commons/config.json'),
        '@Store': path.resolve(__dirname, './store')
      },
    },
    define: {
      '__DETAILED_ERR__': !isProd,
    },
  }
})
