import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended, // 👈 this fixes it
});

const eslintConfig = [
  js.configs.recommended, // base ESLint rules
  ...compat.extends(
    "plugin:n/recommended",
    "prettier"
  ),
  ...compat.config({
    env: {
      node: true,
      es2022: true,
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-console": "off",
      "semi": ["error", "always"],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-implicit-any-catch": ["error", { allowExplicitAny: true }],
    },
  }),
];

export default eslintConfig;
