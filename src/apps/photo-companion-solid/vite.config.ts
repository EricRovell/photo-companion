import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidMarkedPlugin from "vite-plugin-solid-marked";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [
		solid({
			extensions: [
				".md"
			]
		}),
		solidMarkedPlugin({})
	],
	resolve: {
		alias: {
			"@lib": resolve(__dirname, "./src/lib"),
			"@stores": resolve(__dirname, "./src/lib/stores")
		}
	}
});
