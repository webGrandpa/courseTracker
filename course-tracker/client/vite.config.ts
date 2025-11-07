// client/vite.config.ts

/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true, // "Включить" expect, test, ... глобально
    environment: 'jsdom', // Включить "фейковый браузер"
    setupFiles: './src/test-setup.ts', // Файл для "словаря" (jest-dom)
  },
})