import solid from "@solidjs/vite-plugin";
import { fileURLToPath, URL } from "node:url";
import solidMarkedPlugin from "unplugin-solid-marked";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [ solidMarkedPlugin.vite({}), solid({ refresh: false }) ],
	resolve: {
		alias: {
			"~": fileURLToPath(new URL("./src", import.meta.url)),
			"~test": fileURLToPath(new URL("./test", import.meta.url))
		},
		conditions: [ "development", "browser" ]
	},
	test: {
		env: { TZ: "UTC" },
		environment: "jsdom",
		pool: "vmForks",
		server: {
			deps: {
				inline: [ /solid-js/, /@solidjs/ ]
			}
		},
		setupFiles: [ "./test/setup.ts" ]
	}
});
