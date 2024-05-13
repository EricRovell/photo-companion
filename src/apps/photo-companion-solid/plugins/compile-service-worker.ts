import * as child from "child_process";
import { build } from "esbuild";
import { join } from "node:path";
import type { PluginOption } from "vite";
import { replace } from "esbuild-plugin-replace";

/**
 * Returns the hash of the latest git commit
 */
export function getCommitHash(short = false) {
	return child
		.execSync(`git rev-parse ${short ? "--short" : ""} HEAD`)
		.toString()
		.trim();
}

export const compileServiceWorker: PluginOption = {
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
						"__COMMIT_HASH__": () => getCommitHash()
					}
				})
			]
		});
	}
};
