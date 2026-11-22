import replace from "@rollup/plugin-replace";
import solid from "@solidjs/vite-plugin";
import * as child from "child_process";
import { resolve } from "node:path";
import pluginPostCssNesting from "postcss-nesting";
import { visualizer } from "rollup-plugin-visualizer";
import solidMarkedPlugin from "unplugin-solid-marked";
import { defineConfig } from "vite";

import { compileServiceWorker } from "./plugins/compile-service-worker.ts";

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
		solidMarkedPlugin.vite({}),
		solid(),
		compileServiceWorker,
		visualizer()
	],
	resolve: {
		alias: {
			"~": resolve(import.meta.dirname, "./src")
		}
	}
});
