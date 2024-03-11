<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { Icon, Link } from "ui";

	import { dict } from "@lib/dict";
	import { navigationStore } from "@lib/stores";
	import { scrollToTop } from "@lib/helpers";
	import styles from "./navigation.module.css";
</script>

<nav class="{styles.navigation}">
	<ul>
		{#each $navigationStore as { label, href, icon, current }}
			<li>
				<Link
					current="{current ? "page": undefined}"
					className="{styles.link}"
					href="{href}{$query}"
					on:click="{scrollToTop}"
				>
					<Icon path="{icon}" viewBox="0 0 256 256" />
					<span>{dict.TITLE[label]}</span>
				</Link>
			</li>
		{/each}
	</ul>
</nav>
