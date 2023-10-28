<script lang="ts" context="module">
	import type { ComponentType } from "svelte";

	interface Tab {
		label: string;
		value: string;
		component: ComponentType;
	}
</script>

<script lang="ts">
	import styles from "./tabs.module.css";

	export let tabs: Tab[] = [];

	let current = tabs[0].value;

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		current = value;
		scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
</script>

<div class="{styles.tabs}">
	<form
		class="{styles["tab-list"]}"
		on:submit|preventDefault
		on:change="{handleChange}"
	>
		{#each tabs as { label, value}}
			<label class="{styles.tab}">
				<input
					checked="{value === current}"
					type="radio"
					name="tabs"
					{value}
				>
				<span>{label}</span>
			</label>
		{/each}
	</form>
	<div class="{styles["tab-panel-wrapper"]}">
		{#each tabs as { component, value }}
			<svelte:component
				this="{current === value ? component : null}"
			/>
		{/each}
	</div>
</div>
