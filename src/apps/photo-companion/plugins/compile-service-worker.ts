
import { build } from "esbuild";
import { replace } from "esbuild-plugin-replace";
import { randomUUID } from "node:crypto";
import { join } from "node:path";

import type { PluginOption } from "vite";

/**
 * Storing build assets (`.js` and `.css` bundles)
 * to inject the URLs into service-worker.
 */
let bundles: string[] = [];

export const compileServiceWorker: PluginOption = {
	apply: "build",
	enforce: "post",
	generateBundle(this, options, bundle) {
		bundles = [ ...Object.keys(bundle) ].map(item => `/${item}`);
	},
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
						"__SERVICE_WORKER_ASSETS__": () => JSON.stringify(bundles),
						"__VERSION_HASH__": () => JSON.stringify(randomUUID())
					}
				})
			],
			target: "es2022"
		});
	}
};
