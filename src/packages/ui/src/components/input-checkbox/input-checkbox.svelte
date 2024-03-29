<script lang="ts">
	import { classnames } from "utils";
	
	import styles from "./input-checkbox.module.css";
	
	type SymbolType = Nullish<"CHECK" | "CROSS" | "MINUS">;

	export let checked: Undefinable<boolean> = undefined;
	export let className: string | undefined = undefined;
	export let disabled: Undefinable<boolean> = undefined;
	export let indeterminate: Nullable<boolean> = undefined;
	export let label: Undefinable<string> = undefined;
	export let name: Undefinable<string> = undefined;
	export let ref: Undefinable<HTMLInputElement> = undefined;
	export let symbolChecked: SymbolType = "CHECK";
	export let symbolUnchecked: SymbolType = null;
	export let symbolIndeterminate: SymbolType = "MINUS";
	export let value: Undefinable<string> = undefined;

	const PATH = {
		CHECK : "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z",
		CROSS: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z",
		MINUS: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"
	};
</script>

<label class="{classnames(styles.label, className)}">
	<input
		bind:this="{ref}"
		class="{styles.input}"
		{disabled}
		indeterminate="{!checked && indeterminate}"
		checked="{!indeterminate && checked}"
		on:change
		type="checkbox"
		{name}
		{value}
		{...$$restProps}
	/>
	<svg class="{styles.box}" viewBox="0 0 256 256">
		{#if symbolChecked}
			<path data-checked d="{PATH[symbolChecked]}" />
		{/if}
		{#if symbolUnchecked}
			<path data-unchecked d="{PATH[symbolUnchecked]}" />
		{/if}
		{#if symbolIndeterminate}
			<path data-indeterminate d="{PATH[symbolIndeterminate]}" />
		{/if}
	</svg>
		{#if label}
			<span>
				{label}
			</span>
		{/if}
</label>
