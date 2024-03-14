<script lang="ts">
	import styles from "./card-info.module.css";

	export let data: Record<string, string | number> = {};
</script>

<article class="{styles.card}">
	<dl>
		{#each Object.entries(data) as [ key, value ]}
			<dt>{key}</dt>
			<dd>{value}</dd>
		{/each}
	</dl>
</article>
