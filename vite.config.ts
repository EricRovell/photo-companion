import { resolve } from "node:path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import pluginPostCssNesting from "postcss-nesting";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@lib": resolve(__dirname, "./src/lib"),
			"@services": resolve(__dirname, "./src/services")
		}
	},
	plugins: [
		svelte()
	],
	css: {
		postcss: {
			plugins: [
				pluginPostCssNesting
			]
		}
	},
	optimizeDeps: {
		exclude: [ "fsevents" ]
	}
});
