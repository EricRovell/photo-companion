// @ts-check

import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import relativeImportsWithinSlice from "./rules/relative-imports-within-slice.js";

const FSD_SOURCE_ROOT = "packages/photo-companion/src";
const FSD_SOURCE_ROOT_URL = new URL("../../packages/photo-companion/src/", import.meta.url);
const FSD_SLICED_LAYERS = [ "entities", "features", "pages", "widgets" ];

const fsdPlugin = {
	rules: {
		"relative-imports-within-slice": relativeImportsWithinSlice
	}
};

/** @type {import("typescript-eslint").ConfigWithExtends[]} */
const relativeImportRules = FSD_SLICED_LAYERS.flatMap(layer => {
	const layerDirectory = new URL(`./${layer}/`, FSD_SOURCE_ROOT_URL);

	if (!existsSync(layerDirectory)) {
		return [];
	}

	return readdirSync(layerDirectory, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => ({
			files: [ `${FSD_SOURCE_ROOT}/${layer}/${entry.name}/**/*.{ts,tsx}` ],
			name: `fsd/relative-imports-within-${layer}/${entry.name}`,
			rules: {
				"fsd/relative-imports-within-slice": [
					"error",
					{
						alias: `~/${layer}/${entry.name}`,
						sliceRoot: fileURLToPath(new URL(`./${entry.name}/`, layerDirectory))
					}
				]
			}
		}));
});

/** @type {import("typescript-eslint").ConfigWithExtends[]} */
const relativeImportsWithinSlices = [
	{
		name: "fsd/plugin",
		plugins: {
			fsd: fsdPlugin
		}
	},
	...relativeImportRules
];

export default relativeImportsWithinSlices;
