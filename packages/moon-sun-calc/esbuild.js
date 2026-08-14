import { build } from "esbuild";

await build({
	bundle: true,
	entryPoints: [ "./src/index.ts" ],
	format: "esm",
	minify: false,
	outdir: "./dist",
	platform: "neutral",
	target: "es2022"
});
