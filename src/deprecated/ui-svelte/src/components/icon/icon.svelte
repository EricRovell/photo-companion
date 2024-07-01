<script lang="ts">
	import { classnames } from "utils";

	import styles from "./icon.module.css";

	export let className: Undefinable<string> = undefined;
	export let title: Undefinable<string> = undefined;
	export let viewBox = "0 0 256 256";
	export let path: Undefinable<string> = undefined;
</script>

<svelte:options namespace="svg" />

<svg
	aria-labelledby={title}
	class="{classnames(styles.icon, className)}"
	role="presentation"
	{viewBox}
	{...$$restProps}
>
		{#if title}
			<title>{title}</title>
		{/if}
		<path d={path} />
</svg>
