<script lang="ts">
	import styles from "./form.module.css";

	export let className = "";
	export let legend: string | undefined = undefined;
</script>

<fieldset class="{styles.fieldset} {className}" {...$$restProps}>
	{#if legend}
		<legend>
			{legend}
		</legend>
	{/if}
	<div>
		<slot />
	</div>
</fieldset>
