<script lang="ts">
	import Datetime from "../datetime/datetime.svelte";
	import styles from "./timeline.module.css";

	export let date: Date | undefined = undefined;
</script>

<li class="{styles["timeline-entry"]}" class:no-date="{!date}">
	<Datetime
		{date}
		options={{
			hour12: false,
			hour: "2-digit",
			minute: "2-digit"
		}}
	/>
	<div class="{styles.icon}">
		<slot />
	</div>
	<slot name="label" />
</li>
