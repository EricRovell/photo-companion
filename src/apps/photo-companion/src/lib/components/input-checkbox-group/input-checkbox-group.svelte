<script lang="ts">
	import InputCheckbox from "../input-checkbox/input-checkbox.svelte";
	import styles from "./input-checkbox-group.module.css";

	export let disabled: boolean | undefined = undefined;
	export let groupLabel: string;
	export let groupValue: string;
	export let name: string | undefined = undefined;
	export let options: { label: string, value: string }[] = [];
	export let value: string[] | null = [];

	let rootCheckboxRef: HTMLInputElement | undefined = undefined;

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const isRoot = target.hasAttribute("data-root");

		if (isRoot) {
			value = target.checked ? null : [];
			return;
		}

		if (target.checked && !value) {
			value = [];
		}

		if (!target.checked && !value) {
			value = options.map(option => option.value);
		}

		if (target.checked) {
			value = [ ...value!, target.value ];
		} else {
			value = value!.filter(item => item !== target.value);
		}

		if (Array.isArray(value) && value.length === options.length) {
			value = null;
		}
	};
</script>

<!--
	Note: The checkbox state is reversed visually for the user.

	This checkbox group behaves like a disallow list under the hood,
	knowing which events are NOT allowed makes code easier,
	as for allow list we should not all possible events ahead.
-->
<fieldset
	class="{styles["checkbox-group"]}"
	on:change="{handleChange}"
>
	<details data-disabled="{disabled ? "" : undefined}">
		<summary>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<polygon points="21.11 5.5 12 15.72 2.89 5.5 2 7.28 12 18.5 22 7.28 21.11 5.5" />
			</svg>
			<InputCheckbox
				bind:ref="{rootCheckboxRef}"
				indeterminate="{value && value.length !== 0 && value.length < options.length}"
				checked="{!value}"
				data-group="{groupValue}"
				data-root
				{disabled}
				label="{groupLabel}"
				type="checkbox"
				{name}
				symbolUnchecked="CHECK"
				symbolChecked="{null}"
				value={groupValue}
			/>
		</summary>
		<ul>
			{#each options as option}
				<li>
					<InputCheckbox
						checked="{!value || value?.includes(option.value)}"
						data-group="{groupValue}"
						{disabled}
						label="{option.label}"
						{name}
						symbolUnchecked="CHECK"
						symbolChecked="{null}"
						type="checkbox"
						value="{option.value}"
					/>
				</li>
			{/each}
		</ul>
	</details>
</fieldset>
