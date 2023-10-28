<script lang="ts">
	import { afterUpdate } from "svelte";
	import { Gauge, Bulb } from "../../components";
	import { ViewDate } from "../../layout";
	import { getScheduleStateByDate } from "../../services/schedule/schedule-by-date";
	import { formatTime, getAngleFromTime } from "../../helpers";
	import { currentYear } from "../../constants";
	import styles from "./info-by-date.module.css";

	let date: string = new Date().toISOString().substring(0, 10);
	let state: ReturnType<typeof getScheduleStateByDate>;

	afterUpdate(() => {
		state = getScheduleStateByDate(new Date(date).getTime());
	});
</script>

<section id="info-by-date" class="card {styles.root}">
	<header>
		<h2>Данные об освещении по датам</h2>
	</header>
	{#if state}
		<ViewDate
			bind:date
			disabledPreviousControl="{new Date(date).getDate() === 1 && new Date(date).getMonth() === 0}"
			disabledNextControl="{new Date(date).getDate() === 31 && new Date(date).getMonth() === 11}"
			maxDate={`${currentYear}-12-31`}
			minDate={`${currentYear}-01-01`}
		>
			<Gauge
				angleStart="{getAngleFromTime(new Date(state.timestampOn))}"
				angleEnd="{getAngleFromTime(new Date(state.timestampOff))}"
				labelStart="{formatTime(state.timestampOn)}"
				labelEnd="{formatTime(state.timestampOff)}"
			>
				<Bulb x="-10" y="-10" width="20" height="20" glow />
			</Gauge>
		</ViewDate>
	{/if}
</section>
