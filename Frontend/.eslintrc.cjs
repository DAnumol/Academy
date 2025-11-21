/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }],
    'no-console': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn'
  }
}