import replace from "@rollup/plugin-replace";
import * as child from "child_process";
import { resolve } from "node:path";
import pluginPostCssNesting from "postcss-nesting";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidMarkedPlugin from "vite-plugin-solid-marked";

import { compileServiceWorker } from "./plugins/compile-service-worker";

/**
 * Returns the hash of the latest git commit
 */
export function getCommitHash(short = false) {
	return child
		.execSync(`git rev-parse ${short ? "--short" : ""} HEAD`)
		.toString()
		.trim();
}

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
		compileServiceWorker,
		visualizer()
	],
	resolve: {
		alias: {
			"@lib": resolve(__dirname, "./src/lib")
		}
	}
});
