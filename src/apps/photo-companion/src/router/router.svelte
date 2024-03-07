<script lang="ts">
	import type { ComponentType } from "svelte";

	export let root: ComponentType | undefined = undefined;
</script>

{#if root}
	<svelte:component this="{root}">
		<slot />
	</svelte:component>
{:else}
	<slot />
{/if}
