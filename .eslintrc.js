module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended', // React recommended rules plugin
    'plugin:@typescript-eslint/recommended', // Plugin to use typescript with eslint
    'prettier', // Add prettier rules to eslint
    'plugin:prettier/recommended', // Plugin to use prettier rules with eslint
    'plugin:react/jsx-runtime', // Add runtime rules for React 17
  ],
  plugins: ['react-hooks'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
