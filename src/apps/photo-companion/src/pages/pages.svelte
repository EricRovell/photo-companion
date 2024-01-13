<script lang="ts">
	import { pattern } from "svelte-pathfinder";
	import { WithDateURL, Article } from "@lib/layout";

	import PageAbout from "./about/about.page.mdx";
	import PageBridges from "./bridges/bridges.page.svelte";
	import PageChangelog from "./changelog.page.mdx";
	import PageLights from "./lights/lights.page.svelte";
	import PageMoon from "./moon/moon.page.svelte";
	import PageSettings from "./settings/settings.page.svelte";
	import PageSun from "./sun/sun.page.svelte";
	import PageTimeline from "./timeline/timeline.page.svelte";

	import {
		routeAbout,
		routeBridges,
		routeChangelog,
		routeLights,
		routeMoon,
		routeSettings,
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
		"article": {
			[routeAbout]: PageAbout,
			[routeChangelog]: PageChangelog
		},
		"page": {
			[routeBridges]: PageBridges,
			[routeSettings]: PageSettings
		}
	};
</script>

{#each Object.entries(routes["datetime"]) as [ route, Page ]}
	{#if $pattern(route)}
		<WithDateURL page="{Page}" />
	{/if}
{/each}

{#each Object.entries(routes["article"]) as [ route, Page ]}
	{#if $pattern(route)}
		<Article>
			<Page />
		</Article>
	{/if}
{/each}

{#each Object.entries(routes["page"]) as [ route, Page ]}
	{#if $pattern(route)}
		<Page />
	{/if}
{/each}
