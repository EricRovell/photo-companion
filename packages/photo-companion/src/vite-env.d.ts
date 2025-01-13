/// <reference types="vite/client" />

declare module "*.md" {
	import type { Component } from "solid-js";
	const component: Component;

	export default component;
}
