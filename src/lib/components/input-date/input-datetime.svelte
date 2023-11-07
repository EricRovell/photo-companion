<script lang="ts">
	import styles from "./input-date.module.css";

	export let max: string | undefined = undefined;
	export let min: string | undefined = undefined;
	export let title: string | undefined = undefined;
	export let value: string = new Date().toISOString();

	$: inputValue = value.substring(0, 16);
</script>

<label class="{styles["input-date"]}">
	<slot />
	<input
		type="datetime-local"
		{max}
		{min}
		on:change
		{title}
		value="{inputValue}"
		{...$$restProps}
	/>
</label>
