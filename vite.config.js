import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 读取 .env / .env.[mode] 里的变量
  const env = loadEnv(mode, process.cwd())

  return {
    server: {
      open: true,
      // 开发时把 /api、/auth 转发到后端，行为与生产环境的 nginx / YARP 一致
      // 这样开发和生产都用相对路径，代码无需区分环境
      proxy: {
        '/api': {
          target: env.VITE_PROXY_API,
          changeOrigin: true,
        },
        '/auth': {
          target: env.VITE_PROXY_AUTH,
          changeOrigin: true,
        },
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    plugins: [
      vue(),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  }
})
