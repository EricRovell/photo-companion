<script lang="ts">
	import { classnames } from "utils";

	import styles from "./details.module.css";

	export let className: Undefinable<string> = undefined;
	export let open = false;
	export let title: Undefinable<string> = undefined;
</script>

<details bind:open class="{classnames(styles.details, className)}">
	<summary class="{styles.summary}">
		<span class={`ellipsis ${styles.title}`}>
			{#if title}
				{title}
			{:else}
				<slot name="title">
					Title was not defined
				</slot>
			{/if}
		</span>
		<slot name="icon">
			<svg class={styles["icon"]} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<polygon points="21.11 5.5 12 15.72 2.89 5.5 2 7.28 12 18.5 22 7.28 21.11 5.5" />
			</svg>
		</slot>
	</summary>
	<div class={styles.content}>
		<slot />
	</div>
</details>
