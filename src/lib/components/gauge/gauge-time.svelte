<script lang="ts">
	import Gauge from "./gauge.svelte";
	import { getAngleFromTime, formatTime } from "../../helpers";

	export let timeFrom: Date;
	export let timeTo: Date;
</script>

<Gauge
	angleStart={getAngleFromTime(timeFrom)}
	labelStart="{formatTime(timeFrom.getTime())}"
	angleEnd={getAngleFromTime(timeTo)}
	labelEnd="{formatTime(timeTo.getTime())}"
	{...$$restProps}
>
	<slot />
</Gauge>
