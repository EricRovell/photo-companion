
import { build } from "esbuild";
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
			define: {
				"__SERVICE_WORKER_ASSETS__": JSON.stringify(bundles),
				"__VERSION_HASH__": JSON.stringify(randomUUID())
			},
			entryPoints: [ join(process.cwd(), "src", "features", "service-worker", "service-worker.js") ],
			minify: true,
			outfile: join(process.cwd(), "dist", "service-worker.js"),
			target: "es2022"
		});
	}
};
