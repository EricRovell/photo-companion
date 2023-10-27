<script lang="ts">
	import styles from "./button.module.css";

	export let className = "";
	export let disabled = false;
</script>

<button
	class="{styles.button} {className}"
	{disabled}
	on:click
	{...$$restProps}
>
	<slot />
</button>
