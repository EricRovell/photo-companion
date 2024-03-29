<script lang="ts">
	import { classnames } from "utils";

	import styles from "./button.module.css";

	export let className: string | undefined = undefined;
	export let disabled = false;
	export let appearance: "ghost" | "fill" | "outline" = "fill";
	export let color: Nullable<"success" | "danger"> = undefined;
	export let type: HTMLButtonElement["type"] = "button";
</script>

<button
	class="{classnames(styles.button, className)}"
	data-appearance="{appearance}"
	data-color="{color}"
	{disabled}
	on:click
	{type}
	{...$$restProps}
>
	<slot />
</button>
