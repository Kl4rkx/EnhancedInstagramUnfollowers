// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import stylisticPlugin from '@stylistic/eslint-plugin';
import globals from 'globals';

export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist/**', 'node_modules/**', 'scripts/**', 'public/**', 'webpack.config.js', '*.js'],
  },

  // Base recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // React recommended (flat config)
  reactPlugin.configs.flat.recommended,

  // Main config for TypeScript source files
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
      '@stylistic': stylisticPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      react: {
        version: '18.0',
      },
    },
    rules: {
      // ─── TypeScript rules ───────────────────────────────────────────
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'off',
        { accessibility: 'explicit' },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/triple-slash-reference': [
        'error',
        { path: 'always', types: 'prefer-import', lib: 'always' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',

      // ─── Stylistic rules (moved from @typescript-eslint in v8) ──────
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'semi', requireLast: true },
          singleline: { delimiter: 'semi', requireLast: false },
        },
      ],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/type-annotation-spacing': 'error',

      // ─── React hooks ──────────────────────────────────────────────
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // ─── React ────────────────────────────────────────────────────
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never', propElementValues: 'always' },
      ],
      'react/self-closing-comp': [
        'error',
        { component: true, html: true },
      ],

      // ─── Core ESLint rules ────────────────────────────────────────
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'as-needed'],
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'always-multiline'],
      'curly': 'error',
      'comma-spacing': ['error', { before: false, after: true }],
      'eol-last': 'error',
      'eqeqeq': ['error', 'smart'],
      'jsx-quotes': ['error', 'prefer-single'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'guard-for-in': 'error',
      'new-parens': 'error',
      'no-caller': 'error',
      'no-duplicate-imports': 'error',
      'no-eval': 'error',
      'no-extra-bind': 'error',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-return-await': 'error',
      'no-sequences': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-multi-spaces': ['error', { ignoreEOLComments: true }],
      'no-undef-init': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'prefer-object-spread': 'error',
      'quote-props': ['error', 'consistent-as-needed'],
      'radix': 'error',
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', asyncArrow: 'always', named: 'never' },
      ],
      'space-infix-ops': 'error',
      'space-in-parens': ['error', 'never'],
      'spaced-comment': ['error', 'always', { markers: ['/'] }],
    },
  },
);
