import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), basicSsl(), tailwindcss()],
  server: {
    host: true,
    https: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      // Tell the bundler these are provided by global <script> tags at runtime
      external: ['@tensorflow/tfjs', '@tensorflow-models/pose-detection'],
      output: {
        globals: {
          '@tensorflow/tfjs': 'tf',
          '@tensorflow-models/pose-detection': 'poseDetection',
        },
      },
    },
  },

  optimizeDeps: {
    // Prevent Vite's dep-optimizer from touching these packages in dev mode
    exclude: ['@tensorflow/tfjs', '@tensorflow-models/pose-detection', '@mediapipe/pose'],
  },
})
