import replace from "@rollup/plugin-replace";
import { compileServiceWorker, getCommitHash } from "./plugins/compile-service-worker";
import { defineConfig } from "vite";
import { resolve } from "node:path";
import solid from "vite-plugin-solid";
import solidMarkedPlugin from "vite-plugin-solid-marked";
import pluginPostCssNesting from "postcss-nesting";

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
