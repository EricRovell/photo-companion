import * as child from "child_process";
import { join, resolve } from "node:path";
import { type PluginOption, defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import pluginPostCssNesting from "postcss-nesting";
import { build } from "esbuild";
import { replace } from "esbuild-plugin-replace";
import replaceRollup from "@rollup/plugin-replace";

function getHash(short = false) {
	return child
		.execSync(`git rev-parse ${short ? "--short" : ""} HEAD`)
		.toString()
		.trim();
}

const compileServiceWorkerPlugin: PluginOption = {
	name: "compile-service-worker",
	apply: "build",
	enforce: "post",
	transformIndexHtml() {
		void build({
			minify: true,
			bundle: true,
			entryPoints: [ join(process.cwd(), "src", "service-worker.js") ],
			outfile: join(process.cwd(), "dist", "service-worker.js"),
			target: "es2021",
			plugins: [
				replace({
					values: {
						"__COMMIT_HASH__": () => getHash()
					}
				})
			]
		});
	}
};

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@lib": resolve(__dirname, "./src/lib"),
			"@services": resolve(__dirname, "./src/services")
		}
	},
	plugins: [
		replaceRollup({
			preventAssignment: false,
			values: {
				"__COMMIT_HASH__": () => getHash(true)
			}
		}),
		svelte(),
		compileServiceWorkerPlugin
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
