import { build } from "esbuild";

await build({
	entryPoints: [
		"./src/index.ts"
	],
	format: "esm",
	bundle: true,
	minify: true,
	outdir: "./dist"
});
