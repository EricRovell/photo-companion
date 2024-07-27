<script lang="ts">
	import { classnames } from "utils";

	import styles from "./card-info.module.css";

	export let className: Undefinable<string> = undefined;
	export let data: Record<string, string | number> = {};
</script>

<article class="{classnames(styles.card, className)}">
	<dl>
		{#each Object.entries(data) as [ property, value ]}
			<div class="{styles.entry}">
				<dt>{property}</dt>
				<dd class="{styles.value}">{value}</dd>
			</div>
		{/each}
	</dl>
</article>
