import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devtools: {
    enabled: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 自动注入 minix.scss，所有 .scss 文件可直接使用 mixin 无需手动引入
        additionalData: '@use "@/styles/minix.scss" as *;',
      },
    },
  },
});
