import eslintPlugin from '@typescript-eslint/eslint-plugin'
import eslintParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['node_modules/', 'dist/'], // 忽略文件夹
  },
  {
    files: ['**/*.{js,ts}'], // 支持 TypeScript 文件
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: eslintParser, // 使用 TypeScript 解析器
    },
    plugins: {
      '@typescript-eslint': eslintPlugin, // 使用 TypeScript 插件
    },
    rules: {
      semi: ['error', 'never'], // 禁用分号
      quotes: ['error', 'single'], // 强制使用单引号
      '@typescript-eslint/no-unused-vars': 'warn', // 检查未使用变量
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
    },
  },
]
