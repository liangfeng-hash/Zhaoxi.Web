import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/Vue_dist/**', '**/node_modules/**', '**/public/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    name: 'app/browser-globals',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      // 组件名允许单个单词（项目里大量 index.vue）
      'vue/multi-word-component-names': 'off',
      // 未使用的变量只警告，不报错
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // 提交前应清理，但不阻塞开发
      'no-console': 'warn',
      'no-debugger': 'error',
    },
  },

  {
    name: 'app/node-config-files',
    files: ['vite.config.js', 'eslint.config.js', '*.config.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'writable',
        require: 'readonly',
      },
    },
  },

  // 让 Prettier 接管所有格式相关规则，避免两者打架
  skipFormatting,
]
