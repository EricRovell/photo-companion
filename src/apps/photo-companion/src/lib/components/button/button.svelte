<script lang="ts">
	import styles from "./button.module.css";

	export let className = "";
	export let disabled = false;
	export let appearance: "ghost" | "fill" | "outline" = "fill";
</script>

<button
	class="{styles.button} {className}"
	data-appearance="{appearance}"
	{disabled}
	on:click
	{...$$restProps}
>
	<slot />
</button>
