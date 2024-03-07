<script lang="ts">
	import styles from "./input-number.module.css";

	export let className = "";
	export let id: string | undefined = undefined;
	export let list: string | undefined = undefined;
	export let max: number | undefined = undefined;
	export let min: number | undefined = undefined;
	export let name: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let readonly = false;
	export let required = false;
	export let step: number | undefined = undefined;
	export let value: number | undefined = undefined;
</script>

<label class="{styles.label} {className}">
	<slot />
	<input
		bind:value
		class="{styles.input}"
		{id}
		{list}
		{max}
		{min}
		{name}
		on:input
		{placeholder}
		{readonly}
		{required}
		{step}
		type="number"
		{...$$restProps}
	/>
</label>
