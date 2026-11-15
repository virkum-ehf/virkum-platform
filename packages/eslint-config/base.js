import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Shared rules for every TypeScript package: type-aware typescript-eslint rules,
 * sorted imports, explicit type imports. Formatting is left to Prettier.
 *
 * @param {{ tsconfigRootDir: string }} options
 */
export function base({ tsconfigRootDir }) {
  return tseslint.config(
    {
      ignores: [
        "**/node_modules/**",
        "**/.next/**",
        "**/out/**",
        "**/dist/**",
        "**/coverage/**",
        "**/playwright-report/**",
        "**/test-results/**",
        "**/next-env.d.ts",
      ],
    },
    js.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
      languageOptions: {
        globals: { ...globals.browser, ...globals.node },
        parserOptions: { projectService: true, tsconfigRootDir },
      },
      plugins: { "simple-import-sort": simpleImportSort },
      rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
        "@typescript-eslint/no-import-type-side-effects": "error",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        eqeqeq: ["error", "smart"],
        "no-console": ["error", { allow: ["warn", "error"] }],
      },
    },
    {
      files: ["**/*.{js,mjs,cjs}"],
      extends: [tseslint.configs.disableTypeChecked],
    },
    {
      // Command-line scripts report to the terminal.
      files: ["**/scripts/**"],
      rules: { "no-console": "off" },
    },
    {
      // Tests may assert that a value exists.
      files: ["**/*.test.{ts,tsx}", "**/e2e/**"],
      rules: { "@typescript-eslint/no-non-null-assertion": "off" },
    },
    prettier,
  );
}

export default base;
