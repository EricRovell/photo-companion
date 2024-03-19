<script lang="ts">
	import styles from "./input-number.module.css";

	export let className = "";
	export let id: Undefinable<string> = undefined;
	export let list: Undefinable<string> = undefined;
	export let max: Undefinable<number> = undefined;
	export let min: Undefinable<number> = undefined;
	export let name: Undefinable<string> = undefined;
	export let placeholder: Undefinable<string> = undefined;
	export let readonly = false;
	export let required = false;
	export let step: Undefinable<number> = undefined;
	export let value: Undefinable<number> = undefined;
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
