
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

import type { PluginOption } from "vite";

export const compileServiceWorker: PluginOption = {
	apply: "build",
	enforce: "post",
	generateBundle: {
		async handler(_options, bundle) {
			const index = Object.values(bundle).find(output => output.fileName === "index.html");

			if (index?.type !== "asset") {
				this.error("The service worker requires the built index.html");
			}

			const shell = typeof index.source === "string"
				? index.source
				: new TextDecoder().decode(index.source);

			const assets = Object.keys(bundle)
				.filter(fileName => /^assets\/.*\.(?:css|js)$/.test(fileName))
				.sort()
				.map(fileName => `/${fileName}`);

			const revision = createHash("sha256")
				.update(JSON.stringify([ shell, assets ]))
				.digest("hex");

			const worker = await build({
				bundle: true,
				define: {
					"__SERVICE_WORKER_ASSETS__": JSON.stringify(assets),
					"__SERVICE_WORKER_SHELL__": JSON.stringify(shell),
					"__VERSION_HASH__": JSON.stringify(revision)
				},
				entryPoints: [
					resolve(
						import.meta.dirname,
						"../src/features/service-worker/service-worker.ts"
					)
				],
				minify: true,
				target: "es2022",
				write: false
			});

			this.emitFile({
				fileName: "service-worker.js",
				source: worker.outputFiles[0].contents,
				type: "asset"
			});
		},
		order: "post"
	},
	name: "compile-service-worker"
};
