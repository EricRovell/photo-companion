<script lang="ts">
	import { classnames } from "utils";

	import styles from "./form.module.css";

	export let className: Undefinable<string> = undefined;
</script>

<form
	class="{classnames(styles.form, className)}"
	on:change
	on:submit|preventDefault
	{...$$restProps}
>
	<slot />
</form>
