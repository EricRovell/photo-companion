import { mdsvex } from "mdsvex";
import mdsvexConfig, { extensions } from "./mdsvex.config.js";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
	extensions: [
		".svelte",
		".mdx",
		...extensions
	],
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig)
	]
};

export default config;
