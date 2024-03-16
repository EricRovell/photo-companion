<script lang="ts">
	import { path, query } from "svelte-pathfinder";
	import { Icon, Link } from "ui";

	import { dict } from "@lib/dict";
	import { navigationStore, getTabData } from "@lib/stores/navigation";
	import { scrollToTop } from "@lib/helpers";
	import styles from "./navigation.module.css";
</script>

<nav
	class="{styles.navigation}"
	style="--navigation-items-count: {$navigationStore.length}"
>
	<ul class="{styles["nav-items"]}">
		{#each $navigationStore as tab}
			{@const { label, href, icon } = getTabData(tab)}
			<li>
				<Link
					current="{href.includes($path[0]) ? "page" : undefined}"
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
