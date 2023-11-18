<script lang="ts">
	import LightsToday from "./lights-today.svelte";
	import LightsByDate from "./lights-schedule.svelte";

	export let date: Date;
</script>

<LightsByDate {date} />
<LightsToday />
