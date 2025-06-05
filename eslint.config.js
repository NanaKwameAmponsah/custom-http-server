// eslint.config.js
import { defineConfig } from "eslint-define-config";

export default defineConfig({
  // Specify environments
  env: {
    es2021: true,
    node:   true,
    jest:   true,
  },
  // Extend recommended ESLint rules and Prettier integration
  extends: [
    "eslint:recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType:  "module"
  },
  rules: {
    // Example rule adjustments:
    "no-unused-vars": ["warn"],
    "no-console":     "off"
  }
});