<script lang="ts">
	import { fade } from "svelte/transition";
	import { pattern, path } from "svelte-pathfinder";
	import { WithDateURL } from "@lib/layout";

	import PageAbout from "./about/about.page.svelte";
	import PageLights from "./lights/lights.page.svelte";
	import PageMoon from "./moon/moon.page.svelte";
	import PageSun from "./sun/sun.page.svelte";
	import PageTimeline from "./timeline/timeline.page.svelte";

	import styles from "./pages.module.css";

	import {
		routeLights,
		routeAbout,
		routeMoon,
		routeSun,
		routeTimeline
	} from "@lib/routes";

	const routes = {
		"datetime": {
			"/": PageTimeline,
			[routeLights]: PageLights,
			[routeSun]: PageSun,
			[routeMoon]: PageMoon,
			[routeTimeline]: PageTimeline
		},
		"page": {
			[routeAbout]: PageAbout
		}
	};
</script>

{#key $path}
	<div
		class="{styles.page}"
		in:fade="{{ duration: 450 }}"
	>
		{#each Object.entries(routes["datetime"]) as [ route, Page ]}
			{#if $pattern(route)}
				<WithDateURL page="{Page}" />
			{/if}
		{/each}
		{#each Object.entries(routes["page"]) as [ route, Page ]}
			{#if $pattern(route)}
				<Page />
			{/if}
		{/each}
	</div>
{/key}

