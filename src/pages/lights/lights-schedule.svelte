<script lang="ts">
	import { GaugeTime, Bulb } from "@lib/components";
	import { getLightsScheduleByDate } from "@services/lights";
	import styles from "./lights-schedule.module.css";

	export let date: Date;

	let state = getLightsScheduleByDate(date);

	$: state = getLightsScheduleByDate(date);
</script>

<section id="info-by-date" class="card {styles.root}">
	<header>
		<h2>Данные об освещении по датам</h2>
	</header>
	<GaugeTime
		timeFrom="{new Date(state["lights:start"])}"
		timeTo="{new Date(state["lights:end"])}"
	>
		<Bulb x="-10" y="-10" width="20" height="20" glow />
	</GaugeTime>
</section>
