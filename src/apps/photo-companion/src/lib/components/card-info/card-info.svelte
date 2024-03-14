<script lang="ts">
	import styles from "./card-info.module.css";

	export let data: Record<string, string | number> = {};
</script>

<article class="{styles.card}">
	<dl>
		{#each Object.entries(data) as [ property, value ]}
			<div class="{styles.entry}">
				<dt>{property}</dt>
				<dd class="{styles.value}">{value}</dd>
			</div>
		{/each}
	</dl>
</article>
