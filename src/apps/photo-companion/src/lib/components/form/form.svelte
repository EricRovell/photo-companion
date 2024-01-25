<script lang="ts">
	import styles from "./form.module.css";
</script>

<form
	class="{styles.form}"
	on:change
	on:submit|preventDefault
	{...$$restProps}
>
	<slot />
</form>
