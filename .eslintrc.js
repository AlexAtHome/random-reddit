module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
    'import/extensions': [
      '.ts',
      '.json',
    ],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    }
  },
  rules: {
    'prettier/prettier': 'error',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': ['error', 'ignorePackages', {
      ts: 'never',
      js: 'never',
    }],
    'class-methods-use-this': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: false,
        allowHigherOrderFunctions: true,
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'variable',
        'types': ['boolean'],
        'format': ['PascalCase'],
        'prefix': ['is', 'has']
      },
      {
        'selector': 'memberLike',
        'modifiers': ['private'],
        'format': ['camelCase'],
        'leadingUnderscore': 'require'
      },
      {
        'selector': 'interface',
        'format': ['PascalCase'],
        'custom': {
          'regex': '^I[A-Z]',
          'match': true
        }
      },
      {
        'selector': 'typeLike',
        'format': ['PascalCase']
      }
    ]
  }
}