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
    // Errors:
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/no-danger': 'error', // Prevent usage of dangerous JSX props
    'react/self-closing-comp': ['error', { component: true, html: true }],
    'react/void-dom-elements-no-children': 'error', // No passing of children to void DOM elements
    'react/jsx-boolean-value': 'error', // Boolean attributes notation in JSX
    'react/jsx-key': 'error', // Missing iterators/collection literals keys
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    // Disabled:
    'react/react-in-jsx-scope': 'off', // React 17+ doesn't require the explicit import of React
    '@typescript-eslint/no-empty-function': 'off', // Sometimes we use empty functions as context defaults
    /**
     * The following was added by legacy devs to suppress warnings
     */
    '@typescript-eslint/no-explicit-any': 'off',
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
