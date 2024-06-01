import * as child from "child_process";
import { build } from "esbuild";
import { replace } from "esbuild-plugin-replace";
import { join } from "node:path";

import type { PluginOption } from "vite";

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
	apply: "build",
	enforce: "post",
	name: "compile-service-worker",
	transformIndexHtml() {
		void build({
			bundle: true,
			entryPoints: [ join(process.cwd(), "src", "service-worker.js") ],
			minify: true,
			outfile: join(process.cwd(), "dist", "service-worker.js"),
			plugins: [
				replace({
					values: {
						"__COMMIT_HASH__": () => getCommitHash()
					}
				})
			],
			target: "es2021"
		});
	}
};
