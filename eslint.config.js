import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import path from "path";

export default [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"], // Apply to TypeScript & JavaScript files
    languageOptions: {
      parser: typescriptEslintParser, // Use TypeScript parser
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: path.resolve("./tsconfig.json"), // Link to tsconfig.json
      },
    },
    plugins: {
      import: eslintPluginImport,
      "@typescript-eslint": typescriptEslintPlugin,
      "simple-import-sort": eslintPluginSimpleImportSort,
      prettier: eslintPluginPrettier
    },
    rules: {
      // TypeScript recommended rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",

      // Other useful rules
      "no-console": "warn",
      "object-curly-spacing": ["error", "always"],
      "prettier/prettier": "error",
      // "import/order": ["error", {
      //   groups: [
      //     ["builtin", "external"], // Built-in and external imports
      //     ["internal"], // Internal imports (e.g., aliases)
      //     ["parent", "sibling", "index"], // Parent, sibling, and index imports
      //   ],
      //   pathGroups: [
      //     {
      //       pattern: "@components/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //     {
      //       pattern: "@hooks/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //     {
      //       pattern: "@models/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //     {
      //       pattern: "@pages/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //     {
      //       pattern: "@redux/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //     {
      //       pattern: "@routes/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //     {
      //       pattern: "@services/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //     {
      //       pattern: "@translations/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //     {
      //       pattern: "@utils/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //     {
      //       pattern: "@root/**",
      //       group: "internal",
      //       position: "after",
      //     },
      //   ],
      //   pathGroupsExcludedImportTypes: ["builtin"],
      //   // "newlines-between": "always",
      // }],
      // Configure simple-import-sort
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Side effect imports.
            ["^\\u0000"],
            // Node.js builtins prefixed with `node:`.
            ["^node:"],
            // Packages.
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ["^@?\\w"],
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ["^"],
            // Relative imports.
            // Anything that starts with a dot.
            ["^\\."],
          ]
        },
      ],
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error"
    },
    settings: {
      ...eslintConfigPrettier, // Disable conflicting ESLint rules
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
];
