import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@/apis': path.resolve(__dirname, 'src/apis'),
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/layout': path.resolve(__dirname, 'src/layout'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/plugins': path.resolve(__dirname, 'src/plugins'),
      '@/router': path.resolve(__dirname, 'src/router'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 配置全局 SCSS 变量和混入
        additionalData: `
        @import "@/assets/styles/variables.scss";
      `,
      },
    },
  },
  server: {
    // 开发服务器配置
    open: true, // 自动打开浏览器
    proxy: {
      // 配置 API 代理
      '/api': {
        target: 'http://192.168.3.9:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // 生产构建配置
    outDir: 'dist', // 输出目录
    assetsDir: 'assets', // 静态资源目录
    sourcemap: true, // 是否生成 sourcemap
  },
})
