import { mdsvex } from "mdsvex";
import mdsvexConfig, { FILE_EXTENTIONS } from "./mdsvex.config.js";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
	extensions: [
		".svelte",
		...FILE_EXTENTIONS
	],
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig)
	]
};

export default config;
