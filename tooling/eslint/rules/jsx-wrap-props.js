// @ts-check

/** @typedef {{ type: string; range: [number, number]; loc: { start: { line: number; column: number }; end: { line: number; column: number } } }} JSXNode */
/** @typedef {JSXNode & { closingElement: JSXNode | null }} JSXElement */
/** @typedef {JSXNode & { attributes: JSXNode[]; name: JSXNode; parent: JSXElement; selfClosing: boolean; typeArguments?: JSXNode; typeParameters?: JSXNode }} JSXOpeningElement */
/** @typedef {{ maxWidth?: number; tabWidth?: number }} RuleOptions */

/**
 * @param {unknown} value
 * @returns {value is RuleOptions}
 */
function isRuleOptions(value) {
	return typeof value === "object"
		&& value !== null
		&& (!("maxWidth" in value) || typeof value.maxWidth === "number")
		&& (!("tabWidth" in value) || typeof value.tabWidth === "number");
}

/**
 * @param {string} text
 * @param {number} tabWidth
 */
function getWidth(text, tabWidth) {
	return Array.from(text).reduce((width, character) => {
		return character === "\t" ? width + tabWidth - width % tabWidth : width + 1;
	}, 0);
}

/** @type {import("eslint").Rule.RuleModule} */
const jsxWrapProps = {
	create(context) {
		const options = /** @type {unknown} */ (context.options[0]);
		const { maxWidth = 65, tabWidth = 2 } = isRuleOptions(options) ? options : {};
		const source = context.sourceCode;
		const newline = source.text.includes("\r\n") ? "\r\n" : "\n";

		return {
			/** @param {import("eslint").Rule.Node} rawNode */
			JSXOpeningElement(rawNode) {
				// ESLint's core node types do not include parser extensions such as JSX.
				const node = /** @type {JSXOpeningElement} */ (/** @type {unknown} */ (rawNode));

				const element = node.parent;
				const line = source.lines[node.loc.start.line - 1];
				const end = element.loc.end.line === node.loc.start.line ? element : node;
				const multiline = node.loc.start.line !== node.loc.end.line;

				// Measure from "<" so nesting and preceding code do not affect wrapping.
				if (!multiline && getWidth(line.slice(node.loc.start.column, end.loc.end.column), tabWidth) <= maxWidth) {
					return;
				}

				const indent = /^[\t ]*/.exec(line)?.[0] ?? "";
				/** @type {{ range: [number, number]; text: string }[]} */
				const changes = [];

				/**
				 * Change only the trailing whitespace in a gap, preserving any comments.
				 * @param {number} start
				 * @param {number} end
				 * @param {string} text
				 */
				function replaceGap(start, end, text) {
					const whitespace = /\s*$/.exec(source.text.slice(start, end))?.[0] ?? "";

					if (whitespace !== text) {
						changes.push({ range: [ end - whitespace.length, end ], text });
					}
				}

				// Moving the children leaves the opening tag on its own line.
				const wrapProps = multiline || getWidth(line.slice(node.loc.start.column, node.loc.end.column), tabWidth) > maxWidth;

				if (wrapProps && node.attributes.length > 0) {
					let previous = node.typeArguments ?? node.typeParameters ?? node.name;

					for (const attribute of node.attributes) {
						replaceGap(previous.range[1], attribute.range[0], `${newline}${indent}\t`);
						previous = attribute;
					}

					replaceGap(previous.range[1], node.range[1] - (node.selfClosing ? 2 : 1), `${newline}${indent}`);
				}

				if (element.closingElement) {
					const bodyStart = node.range[1];
					const bodyEnd = element.closingElement.range[0];
					const body = source.text.slice(bodyStart, bodyEnd);

					// Keep meaningful spaces at the edges of inline JSX text unchanged.
					// Existing multiline children and expression contents are also left intact.
					if (!body || (!/[\r\n]/.test(body) && !/^\s|\s$/.test(body))) {
						changes.push({
							range: [ bodyStart, bodyEnd ],
							text: body ? `${newline}${indent}\t${body}${newline}${indent}` : `${newline}${indent}`
						});
					}
				}

				if (changes.length > 0) {
					context.report({
						data: { maxWidth },
						fix: fixer => changes.map(change => fixer.replaceTextRange(change.range, change.text)),
						messageId: "wrap",
						node
					});
				}
			}
		};
	},
	meta: {
		docs: {
				description: "Wrap JSX children before props to fit the configured width, measured from the opening <."
		},
		fixable: "whitespace",
		messages: {
			wrap: "Wrap JSX children, then props if needed, to fit {{maxWidth}} columns."
		},
		schema: [
			{
				additionalProperties: false,
				properties: {
					maxWidth: { minimum: 1, type: "integer" },
					tabWidth: { minimum: 1, type: "integer" }
				},
				type: "object"
			}
		],
		type: "layout"
	}
};

export default jsxWrapProps;
