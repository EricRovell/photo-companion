<script lang="ts">
	import styles from "./input-text.module.css";

	export let className = "";
	export let inputmode: "numeric" | "text" | undefined = undefined;
	export let maxlength: number | undefined = undefined;
	export let minlength: number | undefined = undefined;
	export let name: string | undefined = undefined;
	export let pattern: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let readonly = false;
	export let required = false;
	export let size: number | undefined = undefined;
	export let spellcheck = false;
	export let value = "";
</script>

<label class="{styles.label} {className}">
	<slot />
	<input
		bind:value
		class="{styles.input}"
		{maxlength}
		{minlength}
		{name}
		on:input
		{pattern}
		{placeholder}
		{readonly}
		{required}
		{size}
		{spellcheck}
		type="text"
		{inputmode}
		{...$$restProps}
	/>
</label>
