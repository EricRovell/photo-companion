<script lang="ts">
	import { afterUpdate } from "svelte";
	import { GaugeTime, Bulb } from "@lib/components";
	import { ViewDate } from "@lib/layout";
	import { getLightsScheduleByDate } from "@services/lights";
	import styles from "./lights-schedule.module.css";

	let date = new Date().toISOString().substring(0, 10);
	let state = getLightsScheduleByDate(new Date(date));

	afterUpdate(() => {
		state = getLightsScheduleByDate(new Date(date));
	});
</script>

<section id="info-by-date" class="card {styles.root}">
	<header>
		<h2>Данные об освещении по датам</h2>
	</header>
	<ViewDate bind:date>
		<GaugeTime
			timeFrom="{new Date(state["lights:start"])}"
			timeTo="{new Date(state["lights:end"])}"
		>
			<Bulb x="-10" y="-10" width="20" height="20" glow />
		</GaugeTime>
	</ViewDate>
</section>
