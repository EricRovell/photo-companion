<script lang="ts">
	import styles from "./form.module.css";

	export let className = "";
	export let legend: Undefinable<string> = undefined;
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
