<script lang="ts">
	import styles from "./timeline.module.css";
</script>

<article class="{styles["timeline"]}">
	<slot name="date" />
	<ol class="{styles["timeline-entries"]}">
		<slot />
	</ol>
</article>
