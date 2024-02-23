<script lang="ts">
	import styles from "./input-checkbox.module.css";

	export let checked: boolean | undefined = undefined;
	export let disabled: boolean | undefined = undefined;
	export let indeterminate: boolean | undefined | null = undefined;
	export let label: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let ref: HTMLInputElement | undefined = undefined;
	export let mode: "check" | "cross" = "check";
	export let value: string | undefined = undefined;

	const PATH_CHECK = "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z";
	const PATH_CROSS = "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z";
	const PATH_INDETERMINATE = "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z";

	let path: string;

	$: path = mode === "check" ? PATH_CHECK : PATH_CROSS;
</script>

<label class="{styles.label}">
	<input
		bind:this="{ref}"
		class="{styles.input}"
		data-mode="{mode}"
		{disabled}
		indeterminate="{!checked && indeterminate}"
		checked="{!indeterminate && checked}"
		type="checkbox"
		{name}
		{value}
		{...$$restProps}
	/>
	<svg class="{styles.box}" viewBox="0 0 256 256">
		<path data-mark d="{path}" />
		<path data-indeterminate d="{PATH_INDETERMINATE}" />
	</svg>
	<span>
		{label}
	</span>
</label>
