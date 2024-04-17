module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "import"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    "quotes": ["error", "double"],
    "semi": ["error", "never"],
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "comma-dangle": ["error", "always-multiline"],
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "no-trailing-spaces": ["error"],
    "no-multi-spaces": ["error"],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "no-unused-vars": ["warn"],
    "no-var": ["error"],
    "prefer-const": ["error"],
    "prefer-template": ["error"],
    "object-curly-spacing": ["error", "always"],

    "import/order": ["error", {
      "newlines-between": "always",
      "groups": [
        "builtin",
        "external",
        "internal",
        "parent",
        "sibling",
        "index",
        "object",
        "type"
      ],
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true,
      },
    }],
  },
}
