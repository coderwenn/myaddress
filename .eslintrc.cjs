// .eslintrc.cjs
module.exports = {
  // 指定环境
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // 使用的解析器
  parser: '@typescript-eslint/parser', // 如果是 JS，可以省略或使用默认
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended', // 如果是 JS，可以去掉这一行
  ],
  // 解析器选项
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  // 插件
  plugins: ['react', '@typescript-eslint', 'react-refresh'],
  // 自定义规则
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要导入 React
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
  },
  // React 特定配置
  settings: {
    react: {
      version: 'detect', // 自动检测 React 版本
    },
  },
};