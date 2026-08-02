import { fileURLToPath, URL } from "node:url";
import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [ solid({ hot: false }) ],
	resolve: {
		alias: {
			"~": fileURLToPath(new URL("./src", import.meta.url))
		},
		conditions: [ "development", "browser" ]
	},
	test: {
		environment: "jsdom",
		server: {
			deps: {
				inline: [ /solid-js/ ]
			}
		},
		setupFiles: [ "./test/setup.ts" ]
	}
});
