import { defineConfig } from 'eslint/config'
import parser from '@typescript-eslint/parser'
import pluginTs from '@typescript-eslint/eslint-plugin'

export default defineConfig([
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {},
  },
])
