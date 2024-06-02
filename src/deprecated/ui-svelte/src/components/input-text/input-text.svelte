<script lang="ts">
	import { classnames } from "utils";

	import styles from "./input-text.module.css";

	export let className: Undefinable<string> = undefined;
	export let inputmode: Undefinable<"numeric" | "text"> = undefined;
	export let maxlength: Undefinable<number> = undefined;
	export let minlength: Undefinable<number> = undefined;
	export let name: Undefinable<string> = undefined;
	export let pattern: Undefinable<string> = undefined;
	export let placeholder: Undefinable<string> = undefined;
	export let readonly = false;
	export let required = false;
	export let size: Undefinable<number> = undefined;
	export let spellcheck = false;
	export let value = "";
</script>

<label class="{classnames(styles.label, className)}">
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
