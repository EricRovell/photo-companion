<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { Icon, Link } from "ui";

	import { dict } from "@lib/dict";
	import { navigationStore } from "@lib/stores";
	import { scrollToTop } from "@lib/helpers";
	import styles from "./navigation.module.css";
</script>

<nav
	class="{styles.navigation}"
	style="--navigation-items-count: {$navigationStore.length}"
>
	<ul class="{styles["nav-items"]}">
		{#each $navigationStore as { label, href, icon, current }}
			<li>
				<Link
					current="{current ? "page": undefined}"
					className="{styles.link}"
					href="{href}{$query}"
					on:click="{scrollToTop}"
				>
					<Icon
						className="{styles.icon}"
						path="{icon}"
						viewBox="0 0 256 256"
					/>
					<span>{dict.TITLE[label]}</span>
				</Link>
			</li>
		{/each}
	</ul>
</nav>
