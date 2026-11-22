// @ts-check

/** @type {import("eslint").Rule.RuleModule} */
const returnObjectNewline = {
	create(context) {
		const source = context.sourceCode;
		const newline = source.text.includes("\r\n") ? "\r\n" : "\n";

		return {
			/** @param {import("eslint").Rule.Node} node */
			"ReturnStatement > ObjectExpression"(node) {
				const { loc, range } = node;
				if (node.type !== "ObjectExpression" || node.properties.length === 0
					|| !loc || !range || loc.start.line !== loc.end.line) {
					return;
				}

				const [ start, end ] = range;
				const body = source.text.slice(start + 1, end - 1).trim();
				const indent = /^[\t ]*/.exec(source.lines[loc.start.line - 1])?.[0] ?? "";

				context.report({
					fix(fixer) {
						return fixer.replaceTextRange([ start + 1, end - 1 ], `${newline}${indent}\t${body}${newline}${indent}`);
					},
					messageId: "multiline",
					node
				});
			}
		};
	},
	meta: {
		docs: { description: "Require multiline formatting for returned object literals with properties." },
		fixable: "whitespace",
		messages: {
			multiline: "Use a multiline object literal in this return statement."
		},
		schema: [],
		type: "layout"
	}
};

export default returnObjectNewline;
