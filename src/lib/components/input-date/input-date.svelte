<script lang="ts">
	import styles from "./input-date.module.css";

	export let max: string | undefined = undefined;
	export let min: string | undefined = undefined;
	export let title: string | undefined = undefined;
	export let value: string = new Date().toISOString();
</script>

<label class="{styles["input-date"]}">
	<slot />
	<input
		type="date"
		{max}
		{min}
		on:change
		{title}
		{value}
		{...$$restProps}
	/>
</label>
