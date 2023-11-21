/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="svelte" />
/// <reference types="vite/client" />

/**
 * Taking from <reference types="mdsvex/globals" />
 */
declare module "*.mdx" {
	import type { SvelteComponent } from "svelte";

	export default class Comp extends SvelteComponent {
		$$prop_def: object;
	}
	export const metadata: Record<string, unknown>;
}
