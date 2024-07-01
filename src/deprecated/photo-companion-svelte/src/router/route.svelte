<script lang="ts">
	import type { ComponentType } from "svelte";
	import { path as pathStore } from "svelte-pathfinder";

	export let component: Undefinable<ComponentType> = undefined;
	export let props: Record<string, unknown> = {};
	export let path: string | string[];

	const isMatch = (input: typeof path) => {
		if (typeof input === "string") {
			return path === $pathStore[0];
		}

		return input.some(item => $pathStore[0] === item);
	};

	let matches: boolean;
	$: matches = isMatch(path), $pathStore;
</script>

{#if matches}
	{#if component}
		<svelte:component this={component} {...props} />
	{:else}
		<slot />
	{/if}
{/if}
