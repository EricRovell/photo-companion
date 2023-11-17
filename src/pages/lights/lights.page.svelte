<script lang="ts">
	import LightsToday from "./lights-today.svelte";
	import LightsByDate from "./lights-schedule.svelte";

	export let date = new Date().getTime();
</script>

<LightsByDate {date} />
<LightsToday />
