<script lang="ts">
	import type { ComponentType } from "svelte";

	export let root: Undefinable<ComponentType> = undefined;
</script>

{#if root}
	<svelte:component this="{root}">
		<slot />
	</svelte:component>
{:else}
	<slot />
{/if}
