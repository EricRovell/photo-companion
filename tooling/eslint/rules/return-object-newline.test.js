// @ts-check

import { RuleTester } from "eslint";
import { describe, it } from "vitest";

import returnObjectNewline from "./return-object-newline.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run("return-object-newline", returnObjectNewline, {
	invalid: [
		{
			code: "function read() {\n\treturn { key: value };\n}",
			errors: [ { messageId: "multiline" } ],
			output: "function read() {\n\treturn {\n\t\tkey: value\n\t};\n}"
		},
		{
			code: "function read() {\r\n\treturn ({ /* keep */ key: 'a  b' });\r\n}",
			errors: [ { messageId: "multiline" } ],
			output: "function read() {\r\n\treturn ({\r\n\t\t/* keep */ key: 'a  b'\r\n\t});\r\n}"
		}
	],
	valid: [
		"function read() {\n\treturn {\n\t\tkey: value\n\t};\n}",
		"function read() { return {}; }",
		"function read() { const result = { key: value }; return result; }",
		"const read = () => ({ key: value });"
	]
});
