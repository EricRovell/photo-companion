<script lang="ts">
	import styles from "./seven-segment-digit.module.css";
</script>

<svg
	class="{styles.digit}"
	viewBox="0 0 30 80"
	xmlns="http://www.w3.org/2000/svg"
>
	<circle
		cx="{15}"
		cy="{18 + 7.5}"
		r="{6.5}"
		fill="var(--color-accent)"
	/>
	<circle
		cx="{15}"
		cy="{2 * 18 + 13 + 7.5}"
		r="{6.5}"
		fill="var(--color-accent)"
	/>
</svg>
