<script lang="ts">
	import { fade } from "svelte/transition";
	import { pattern, path } from "svelte-pathfinder";

	import PageAbout from "./about/about.page.svelte";
	import PageLights from "./lights/lights.page.svelte";
	import PageMoon from "./moon/moon.page.svelte";
	import PageSun from "./sun/sun.page.svelte";
	import PageTimeline from "./timeline/timeline.page.svelte";

	import {
		routeLights,
		routeAbout,
		routeMoon,
		routeSun,
		routeTimeline
	} from "@lib/routes";
</script>

{#key $path}
	<div
		in:fade="{{ duration: 450 }}"
		style="display: grid; gap: var(--space-4); width: 100%"
	>
		{#if $pattern(routeTimeline)}
			<PageTimeline />
		{:else if $pattern(routeLights)}
			<PageLights />
		{:else if $pattern(routeSun)}
			<PageSun />
		{:else if $pattern(routeMoon)}
			<PageMoon />
		{:else if $pattern(routeAbout)}
			<PageAbout />
		{:else}
			<PageTimeline />
		{/if}
	</div>
{/key}

