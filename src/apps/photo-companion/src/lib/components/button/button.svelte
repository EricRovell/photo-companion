<script lang="ts">
	import styles from "./button.module.css";

	export let className = "";
	export let disabled = false;
	export let appearance: "ghost" | "fill" | "outline" = "fill";
	export let color: Nullable<"success" | "danger"> = undefined;
</script>

<button
	class="{styles.button} {className}"
	data-appearance="{appearance}"
	data-color="{color}"
	{disabled}
	on:click
	{...$$restProps}
>
	<slot />
</button>
