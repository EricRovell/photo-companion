import replace from "@rollup/plugin-replace";
import { resolve } from "node:path";
import pluginPostCssNesting from "postcss-nesting";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidMarkedPlugin from "vite-plugin-solid-marked";

import { compileServiceWorker, getCommitHash } from "./plugins/compile-service-worker";

export default defineConfig({
	css: {
		postcss: {
			plugins: [
				pluginPostCssNesting
			]
		}
	},
	plugins: [
		replace({
			preventAssignment: false,
			values: {
				"__COMMIT_HASH__": () => getCommitHash(true)
			}
		}),
		solid({ extensions: [ ".md" ] }),
		solidMarkedPlugin({}),
		compileServiceWorker
	],
	resolve: {
		alias: {
			"@lib": resolve(__dirname, "./src/lib")
		}
	}
});
