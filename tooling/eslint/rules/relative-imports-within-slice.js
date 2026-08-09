// @ts-check

import { dirname, relative, resolve } from "node:path";

/** @typedef {Parameters<NonNullable<import("eslint").Rule.RuleListener["ImportExpression"]>>[0]["source"]} ImportSource */
/** @typedef {{ alias: string; sliceRoot: string }} RuleOptions */

/**
 * @param {unknown} value
 * @returns {value is RuleOptions}
 */
function isRuleOptions(value) {
	return typeof value === "object"
		&& value !== null
		&& "alias" in value
		&& typeof value.alias === "string"
		&& "sliceRoot" in value
		&& typeof value.sliceRoot === "string";
}

/**
 * @param {string} filename
 * @param {string} target
 */
function getRelativeImportPath(filename, target) {
	const importPath = relative(dirname(filename), target).replace(/\\/g, "/");

	return importPath.startsWith(".") ? importPath : `./${importPath}`;
}

/** @type {import("eslint").Rule.RuleModule} */
const relativeImportsWithinSlice = {
	create(context) {
		const options = /** @type {unknown} */ (context.options[0]);

		if (!isRuleOptions(options)) {
			return {};
		}

		const { alias, sliceRoot } = options;

		/** @param {ImportSource} sourceNode */
		function checkSource(sourceNode) {
			if (sourceNode.type !== "Literal" || typeof sourceNode.value !== "string") {
				return;
			}

			const importPath = sourceNode.value;

			if (importPath === alias || importPath === `${alias}/`) {
				context.report({
					messageId: "avoidPublicApi",
					node: sourceNode
				});
				return;
			}

			const aliasPrefix = `${alias}/`;

			if (!importPath.startsWith(aliasPrefix)) {
				return;
			}

			const target = resolve(sliceRoot, importPath.slice(aliasPrefix.length));
			const relativeImportPath = getRelativeImportPath(context.filename, target);
			const sourceText = context.sourceCode.getText(sourceNode);
			const quote = sourceText.at(0) ?? "\"";

			context.report({
				data: { relativeImportPath },
				fix: fixer => fixer.replaceText(sourceNode, `${quote}${relativeImportPath}${quote}`),
				messageId: "useRelative",
				node: sourceNode
			});
		}

		return {
			ExportAllDeclaration: node => {
				checkSource(node.source);
			},
			ExportNamedDeclaration: node => {
				if (node.source) {
					checkSource(node.source);
				}
			},
			ImportDeclaration: node => {
				checkSource(node.source);
			},
			ImportExpression: node => {
				checkSource(node.source);
			}
		};
	},
	meta: {
		docs: {
			description: "Require relative import paths within the same FSD slice."
		},
		fixable: "code",
		messages: {
			avoidPublicApi: "Use a direct relative import instead of the current slice's public API.",
			useRelative: "Use the relative import path '{{relativeImportPath}}' within the current FSD slice."
		},
		schema: [
			{
				additionalProperties: false,
				properties: {
					alias: { type: "string" },
					sliceRoot: { type: "string" }
				},
				required: [ "alias", "sliceRoot" ],
				type: "object"
			}
		],
		type: "problem"
	}
};

export default relativeImportsWithinSlice;
