import { defineMDSveXConfig as defineConfig } from "mdsvex";

const config = defineConfig({
	extensions: [ ".svelte.md", ".md", ".mdx"],
	layout: {
		"_": "./src/lib/layout/default.layout.svelte"
	}
});

export default config;
