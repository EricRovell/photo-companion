<script lang="ts" context="module">
	export interface Option {
		label: string;
		value: string;
	}
</script>

<script lang="ts">
	import type { ChangeEventHandler } from "svelte/elements";
	import { classnames } from "utils";

	import styles from "./input-radio.module.css";

	export let className: Undefinable<string> = undefined;
	export let disabled = false;
	export let name: string;
	export let options: Option[] = [];
	export let value: Optional<string>;

	const handleChange: ChangeEventHandler<HTMLElement> = (event) => {
		const target = event.target as HTMLInputElement;
		value = target.value;
	};
</script>

{#each options as option}
	<label class="{classnames(styles.label, className)}">
		<input
			class="{styles.radio}"
			checked="{value === option.value}"
			{disabled}
			{name}
			on:change="{handleChange}"
			type="radio"
			value="{option.value}"
		/>
		<span />
		{option.label}
	</label>
{/each}
