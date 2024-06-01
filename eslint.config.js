// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid";
import perfectionist from "eslint-plugin-perfectionist";

export default tseslint.config(
	{
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
		rules: eslint.configs.recommended.rules
	},
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		ignores: [
			"**/dist/*",
			"**/node_modules/*",
			"**/service-worker.js",
			"**/photo-companion/*",
			"**/packages/ui/*",
			"**/bundle-dts.js"
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
					"./tsconfig.node.json",
					"./src/**/tsconfig.json",
					"./src/**/tsconfig.test.json",
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
		// @ts-expect-error TODO fix after update
		rules: solid.configs["flat/typescript"].rules,
		languageOptions: {
			parser: tseslint.parser
		}
	},
	{
		files: [ "**/*.{ts,tsx}" ],
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			// TODO next major version will include typing
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			perfectionist: perfectionist
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: [
					"./tsconfig.base.json",
					"./tsconfig.node.json",
					"./src/**/tsconfig.json",
					"./src/**/tsconfig.test.json"
				],
				/* EXPERIMENTAL_useProjectService: {
					maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 12,
				} */
			},
		},
		rules: {
			"perfectionist/sort-array-includes": "error",
			"perfectionist/sort-classes": "error",
			"perfectionist/sort-enums": "error",
			"perfectionist/sort-exports": "error",
			"perfectionist/sort-imports": [
				"error", {
					"ignore-case": true,
					type: "alphabetical",
					order: "asc",
					groups: [
						[ "builtin", "external" ],
						[ "builtin-type", "external-type" ],
						[ "internal" ],
						[ "parent", "sibling" ],
						[ "side-effect" ],
						[ "internal-type", "parent-type", "sibling-type", "index-type" ],
						[ "side-effect-style" ],
						[ "style" ],
						"unknown"
					],
					"newlines-between": "always",
					"internal-pattern": [
						"@lib/**"
					]
				}
			],
			"perfectionist/sort-interfaces": "error",
			"perfectionist/sort-jsx-props": "error",
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
	}
);
