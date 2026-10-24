// @ts-check

import { Linter, RuleTester } from "eslint";
import { describe, expect, it } from "vitest";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";

import jsxWrapProps from "./jsx-wrap-props.js";

RuleTester.describe = describe;
RuleTester.it = it;

const languageOptions = {
	parserOptions: {
		ecmaFeatures: { jsx: true }
	}
};

const ruleTester = new RuleTester({ languageOptions });
const options = [ { maxWidth: 40 } ];

ruleTester.run("jsx-wrap-props", jsxWrapProps, {
	invalid: [
		{
			code: `<Text title="${"x".repeat(65)}" />`,
			errors: [ { messageId: "wrap" } ],
			output: `<Text\n\ttitle="${"x".repeat(65)}"\n/>`
		},
		{
			code: '<Text x="1" y="2">text</Text>',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 28 } ],
			output: '<Text x="1" y="2">\n\ttext\n</Text>'
		},
		{
			code: '<Text x="1" y="2">text</Text>',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 18 } ],
			output: '<Text x="1" y="2">\n\ttext\n</Text>'
		},
		{
			code: '<Text x="1" y="2">text</Text>',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 17 } ],
			output: '<Text\n\tx="1"\n\ty="2"\n>\n\ttext\n</Text>'
		},
		{
			code: '<Text x="1" y="2" z="3" g="6" test="test">text</Text>',
			errors: [ { messageId: "wrap" } ],
			options,
			output: '<Text\n\tx="1"\n\ty="2"\n\tz="3"\n\tg="6"\n\ttest="test"\n>\n\ttext\n</Text>'
		},
		{
			code: '<Text x="12345678901234567890" y="2" />',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 30 } ],
			output: '<Text\n\tx="12345678901234567890"\n\ty="2"\n/>'
		},
		{
			code: '<Text x="1">a child that exceeds the width</Text>',
			errors: [ { messageId: "wrap" } ],
			options,
			output: '<Text x="1">\n\ta child that exceeds the width\n</Text>'
		},
		{
			code: '<Text>A long text node without attributes should also wrap.</Text>',
			errors: [ { messageId: "wrap" } ],
			options,
			output: '<Text>\n\tA long text node without attributes should also wrap.\n</Text>'
		},
		{
			code: '<div><Text x="12345678901234567890" /></div>',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 33 } ],
			output: '<div>\n\t<Text x="12345678901234567890" />\n</div>'
		},
		{
			code: '\t\t<Text x="12345678901234567890" />',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 32, tabWidth: 4 } ],
			output: '\t\t<Text\n\t\t\tx="12345678901234567890"\n\t\t/>'
		},
		{
			code: '<Text {...props} x="12345678901234567890">{value}</Text>',
			errors: [ { messageId: "wrap" } ],
			options,
			output: '<Text\n\t{...props}\n\tx="12345678901234567890"\n>\n\t{value}\n</Text>'
		},
		{
			code: '<Text x="12345678901234567890" y="2"> text </Text>',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 30 } ],
			output: '<Text\n\tx="12345678901234567890"\n\ty="2"\n> text </Text>'
		},
		{
			code: '<Text x="12345678901234567890" y="2">Hello <b>world</b>!</Text>',
			errors: [ { messageId: "wrap" } ],
			options,
			output: '<Text x="12345678901234567890" y="2">\n\tHello <b>world</b>!\n</Text>'
		},
		{
			code: '<Text x="1"\n y="2">text</Text>',
			errors: [ { messageId: "wrap" } ],
			output: '<Text\n\tx="1"\n\ty="2"\n>\n\ttext\n</Text>'
		},
		{
			code: '<Text x="1"\n y="2"></Text>',
			errors: [ { messageId: "wrap" } ],
			output: '<Text\n\tx="1"\n\ty="2"\n>\n</Text>'
		},
		{
			code: '<Text x={{\n\tvalue: "unchanged"\n}} y="2" />',
			errors: [ { messageId: "wrap" } ],
			output: '<Text\n\tx={{\n\tvalue: "unchanged"\n}}\n\ty="2"\n/>'
		},
		{
			code: '<Text /* keep */ x="12345678901234567890" /* also keep */ y="2" />',
			errors: [ { messageId: "wrap" } ],
			options,
			output: '<Text /* keep */\n\tx="12345678901234567890" /* also keep */\n\ty="2"\n/>'
		},
		{
			code: '<Text x="1"\r\n y="2">text</Text>',
			errors: [ { messageId: "wrap" } ],
			output: '<Text\r\n\tx="1"\r\n\ty="2"\r\n>\r\n\ttext\r\n</Text>'
		},
		{
			code: '// Keep CRLF\r\n<Text x="1" y="2">text</Text>',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 18 } ],
			output: '// Keep CRLF\r\n<Text x="1" y="2">\r\n\ttext\r\n</Text>'
		},
		{
			code: '<Text<string> x="12345678901234567890" y="2" />',
			errors: [ { messageId: "wrap" } ],
			languageOptions: { parser: tseslint.parser },
			options,
			output: '<Text<string>\n\tx="12345678901234567890"\n\ty="2"\n/>'
		},
		{
			code: 'const label = <Text x="12345678901234567890" />;',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 32 } ],
			output: 'const label = <Text\n\tx="12345678901234567890"\n/>;'
		},
		{
			code: '<Text x="12345678901234567890" y="2">\n\tExisting children\n</Text>',
			errors: [ { messageId: "wrap" } ],
			options: [ { maxWidth: 30 } ],
			output: '<Text\n\tx="12345678901234567890"\n\ty="2"\n>\n\tExisting children\n</Text>'
		}
	],
	valid: [
		'<Text x="1" y="2">text</Text>',
		{
			code: '\t\t\t\t<Route component={() => props.children} path="/moon" />',
			options: [ { maxWidth: 55 } ]
		},
		{
			code: '                <Route component={() => props.children} path="/moon" />',
			options: [ { maxWidth: 55 } ]
		},
		{
			code: '\t\t<Text x="12345678901234567890" />',
			options: [ { maxWidth: 33, tabWidth: 4 } ]
		},
		{
			code: 'const label = <Text x="12345678901234567890" />;',
			options: [ { maxWidth: 33 } ]
		},
		{ code: '<Text x="1" y="2">text</Text>', options: [ { maxWidth: 29 } ] },
		{ code: '<Text x="1" y="2">\n\ttext\n</Text>', options: [ { maxWidth: 18 } ] },
		{ code: '<Text x="12345678901234567890" />', options: [ { maxWidth: 100 } ] },
		'<Text\n\tx="1"\n\ty="2"\n>\n\ttext\n</Text>',
		{ code: '<Text\n\tx="a single attribute can exceed the configured width"\n/>', options },
		{ code: '<Text x="1"> text with meaningful leading and trailing spaces </Text>', options },
		{ code: '<><Text x="1" /></>', options },
		{ code: '<Text x="1">\n\tAn existing long child does not force a short opening tag to wrap.\n</Text>', options },
		{ code: '\t<Text x="12345678901234567890" />', options: [ { maxWidth: 35, tabWidth: 2 } ] }
	]
});

it.each([
	{
		code: '<Text z="3" x="1" test="test" g="6" y="2">text</Text>',
		maxWidth: 40,
		output: '<Text\n\tg="6"\n\ttest="test"\n\tx="1"\n\ty="2"\n\tz="3"\n>\n\ttext\n</Text>'
	},
	{
		code: '<Text y="2" x="1">a child long enough to exceed the sixty-five column limit</Text>',
		maxWidth: 65,
		output: '<Text x="1" y="2">\n\ta child long enough to exceed the sixty-five column limit\n</Text>'
	}
])("converges with prop sorting and indentation at $maxWidth columns", ({ code, maxWidth, output }) => {
	const linter = new Linter();
	/** @type {import("eslint").Linter.Config[]} */
	const config = [ {
		languageOptions,
		plugins: {
			jsx: { rules: { "wrap-props": jsxWrapProps } },
			perfectionist
		},
		rules: {
			indent: [ "error", "tab", { SwitchCase: 1 } ],
			"jsx/wrap-props": [ "error", { maxWidth } ],
			"perfectionist/sort-jsx-props": [ "error", { type: "alphabetical" } ]
		}
	} ];
	const result = linter.verifyAndFix(code, config);

	expect(result.messages).toEqual([]);
	expect(result.output).toBe(output);
	expect(linter.verifyAndFix(result.output, config).fixed).toBe(false);
});
