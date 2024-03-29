<script lang="ts">
	import { classnames } from "utils";
import styles from "./form.module.css";

	export let className: Undefinable<string> = undefined;
	export let legend: Undefinable<string> = undefined;
</script>

<fieldset class="{classnames(styles.fieldset, className)}" {...$$restProps}>
	{#if legend}
		<legend>
			{legend}
		</legend>
	{/if}
	<div>
		<slot />
	</div>
</fieldset>
