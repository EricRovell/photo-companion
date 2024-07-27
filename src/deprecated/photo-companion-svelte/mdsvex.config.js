import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineMDSveXConfig as defineConfig } from "mdsvex";

export const FILE_EXTENTIONS = [ ".svelte.md", ".md", ".mdx"];
const LAYOUT_PATH = "/src/lib/layout/default.layout.svelte";

const config = defineConfig({
	extensions: FILE_EXTENTIONS,
	layout: {
		// https://github.com/pngwn/MDsveX/issues/556#issue-2043362234
		"_": `${dirname(fileURLToPath(import.meta.url))}${LAYOUT_PATH}`
	}
});

export default config;
