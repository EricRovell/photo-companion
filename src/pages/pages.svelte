<script lang="ts">
	import { pattern } from "svelte-pathfinder";
	import { WithDateURL, Article } from "@lib/layout";

	import PageAbout from "./about/about.page.mdx";
	import PageChangelog from "./changelog.page.mdx";
	import PageLights from "./lights/lights.page.svelte";
	import PageMoon from "./moon/moon.page.svelte";
	import PageSun from "./sun/sun.page.svelte";
	import PageTimeline from "./timeline/timeline.page.svelte";

	import {
		routeAbout,
		routeChangelog,
		routeLights,
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
			[routeAbout]: PageAbout,
			[routeChangelog]: PageChangelog
		}
	};
</script>

{#each Object.entries(routes["datetime"]) as [ route, Page ]}
	{#if $pattern(route)}
		<WithDateURL page="{Page}" />
	{/if}
{/each}

{#each Object.entries(routes["page"]) as [ route, Page ]}
	{#if $pattern(route)}
		<Article>
			<Page />
		</Article>
	{/if}
{/each}
