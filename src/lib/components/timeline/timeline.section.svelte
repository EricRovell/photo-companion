<script lang="ts">
	import Datetime from "../datetime/datetime.svelte";
	import styles from "./timeline.module.css";

	export let date: Date | undefined = undefined;
</script>

<article class="{styles["timeline"]}">
	<Datetime
		{date}
		options={{
			year: "numeric",
			month: "long",
			day: "numeric" 
		}}
	/>
	<ol class="{styles["timeline-entries"]}">
		<slot />
	</ol>
</article>
