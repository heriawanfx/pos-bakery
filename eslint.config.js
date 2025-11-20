import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 🔧 Turn common things into warnings instead of errors
      "no-unused-vars": "off", // use TS version instead
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "react/react-in-jsx-scope": "off", // not needed for React 17+
      "react/prop-types": "off",        // using TypeScript types instead

      // Optional: style-ish warnings
      "no-console": "warn",
      "eqeqeq": ["warn", "always"],
      "jsx-a11y/anchor-is-valid": "warn",
    }
  },
])
