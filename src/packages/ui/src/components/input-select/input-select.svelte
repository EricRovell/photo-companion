<script lang="ts" context="module">
	export interface InputSelectOption {
		disabled?: boolean,
		label: string;
		value: string;
		selected?: boolean;
	}
</script>

<script lang="ts">
	import styles from "./input-select.module.css";

	export let disabled = false;
	export let name: string;
	export let options: InputSelectOption[];
	export let value: Undefinable<string> = undefined;

	if (!value) {
		value = options.find(item => Boolean(item.selected))?.value;
	}
</script>

<label class="{styles.wrapper}">
	<slot />
	<select
		bind:value
		class="{styles.select}"
		{disabled}
		{name}
		on:change
	>
		{#each options as { disabled, value, label, selected }}
			<option {value} {selected} {disabled}>
				{label}
			</option>
		{/each}
	</select>
</label>
