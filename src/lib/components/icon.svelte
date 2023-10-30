<script lang="ts">
	export let title: string | undefined = undefined;
	export let viewBox = "0 0 256 256";
	export let path: string | undefined = undefined;
</script>

<svelte:options namespace="svg" />

<svg
	aria-labelledby={title ?? null}
	role="presentation"
	{viewBox}
	{...$$restProps}
>
		{#if title}
			<title>{title}</title>
		{/if}
		<path d={path} />
</svg>

<style>
	svg {
		aspect-ratio: 1 / 1;
		width: var(--icon-size, 1em);
		height: var(--icon-size, 1em);
		fill: var(--icon-color, currentcolor);
	}
</style>
