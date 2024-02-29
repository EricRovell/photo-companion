<script lang="ts">
	import { path } from "svelte-pathfinder";
	import { WithDateURL, Article } from "@lib/layout";

	import { ROUTES_MAP, ROUTES_LAYOUT_MAP } from "./pages";

	$: route = `/${$path[0]}`;
</script>

{#if ROUTES_LAYOUT_MAP.WITH_DATE_URL.has(route)}
	<WithDateURL page="{ROUTES_MAP[route]}" />
{:else if ROUTES_LAYOUT_MAP.ARTICLE.has(route)}
	<Article>
		<svelte:component this={ROUTES_MAP[route]} />
	</Article>
{:else if ROUTES_LAYOUT_MAP.NONE.has(route)}
	<svelte:component this={ROUTES_MAP[route]} />
{:else}
	<p>404</p>
{/if}
