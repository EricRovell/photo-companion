import { mdsvex } from "mdsvex";
import mdsvexConfig from "./mdsvex.config.js";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
	extensions: [
		".svelte",
		".mdx",
		...mdsvexConfig.extensions
	],
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig)
	],
};

export default config;
