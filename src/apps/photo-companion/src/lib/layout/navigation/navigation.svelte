<script lang="ts">
	import { pattern, query } from "svelte-pathfinder";
	import { Icon, Link } from "ui";
	import { dict } from "@lib/dict";
	import { navigationStore } from "@lib/stores";
	import styles from "./navigation.module.css";
</script>

<nav class="{styles.navigation}">
	<ul>
		{#each $navigationStore as { label, href, icon }}
			<li>
				<Link
					current="{($pattern(href) || ($pattern("/"))) ? "page" : undefined}"
					className="{styles.link}"
					href="{href}{$query}"
				>
					<Icon path="{icon}" viewBox="0 0 256 256" />
					<span>{dict.TITLE[label]}</span>
				</Link>
			</li>
		{/each}
	</ul>
</nav>
