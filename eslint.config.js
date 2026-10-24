// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid";
import perfectionist from "eslint-plugin-perfectionist";

import relativeImportsWithinSlices from "./tooling/eslint/fsd-relative-imports.js";
import jsxWrapProps from "./tooling/eslint/rules/jsx-wrap-props.js";

export default tseslint.config(
	{
		rules: eslint.configs.recommended.rules
	},
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		ignores: [
			"**/coverage/**",
			"**/.vercel/**",
			"**/dist/*",
			"**/node_modules/*",
			"**/bundle-dts.js",
			"eslint.config.js"
		]
	},
	{
		languageOptions: {
			globals: {
				"__dirname": true,
				"DateLike": true,
				"Nullable": true,
				"Nullish": true,
				"VoidFn": true,
				"Undefinable": true
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				},
				project: [
					"./tsconfig.base.json",
					"./tsconfig.eslint.json",
					"./tsconfig.node.json",
					"./packages/**/tsconfig.json",
					"./packages/**/.storybook/tsconfig.json",
					"./packages/**/tsconfig.test.json",
				],
				tsconfigRootDir: import.meta.dirname,
				ecmaVersion: "latest"
			}
		}
	},
	{
		files: [ "**/*.{ts,tsx}" ],
		plugins: {
			"solid": solid.configs["flat/typescript"].plugins.solid
		},
		rules: solid.configs["flat/typescript"].rules,
		languageOptions: {
			parser: tseslint.parser
		}
	},
	{
		files: [ "**/*.{ts,tsx}" ],
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			perfectionist: perfectionist
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: [
					"./tsconfig.base.json",
					"./tsconfig.node.json",
					"./packages/**/tsconfig.json",
					"./packages/**/.storybook/tsconfig.json",
					"./packages/**/tsconfig.test.json"
				]
			},
		},
		rules: {
			"perfectionist/sort-array-includes": "error",
			"perfectionist/sort-classes": "error",
			"perfectionist/sort-enums": "error",
			"perfectionist/sort-exports": "error",
			"perfectionist/sort-imports": [
				"error", {
					ignoreCase: true,
					type: "alphabetical",
					order: "asc",
					groups: [
						[ "builtin", "external" ],
						[ "type-builtin", "type-external" ],
						[ "internal" ],
						[ "parent", "sibling" ],
						[ "side-effect" ],
						[ "type-internal", "type-parent", "type-sibling", "type-index" ],
						[ "side-effect-style" ],
						[ "style" ],
						"unknown"
					],
					newlinesBetween: 1,
					internalPattern: [
						"^~/.*"
					]
				}
			],
			"perfectionist/sort-interfaces": "error",
			"perfectionist/sort-jsx-props": [
				"error",
				{
					type: "unsorted",
					useConfigurationIf: {
						tagMatchesPattern: "^(?:Meta|Show)$"
					}
				},
				{ type: "alphabetical" }
			],
			"perfectionist/sort-maps": "error",
			"perfectionist/sort-named-imports": "error",
			"perfectionist/sort-named-exports": "error",
			"perfectionist/sort-object-types": "error",
			"perfectionist/sort-objects": "error",
			"perfectionist/sort-intersection-types": "error",
			"perfectionist/sort-union-types": "error",
			"no-self-assign": "off",
			"no-console": [ "error", { "allow": [ "warn", "error" ] }],
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unused-vars": [
				"error", { "argsIgnorePattern": "_" }
			],
			"@typescript-eslint/strict-boolean-expressions": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-confusing-void-expression": [ "error", {
				ignoreArrowShorthand: true
			}],
			"@typescript-eslint/restrict-template-expressions": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/restrict-plus-operands": "off",
			"@typescript-eslint/prefer-for-of": "off",
			"comma-dangle": ["error", {
				"arrays": "never",
				"objects": "never",
				"imports": "never",
				"exports": "never"
			}],
			"indent": [ "error", "tab", { "SwitchCase": 1 } ],
			"linebreak-style": 0,
			"quotes": [ "error", "double" ],
			"semi": [ "error", "always" ],
			"no-var": "error",
			"curly": "error"
		}
	},
	...relativeImportsWithinSlices,
	{
		files: [ "**/*.tsx" ],
		name: "jsx/formatting",
		plugins: {
			jsx: {
				rules: {
					"wrap-props": jsxWrapProps
				}
			}
		},
		rules: {
			"jsx/wrap-props": [ "error", { maxWidth: 65, tabWidth: 2 } ]
		}
	}
);
