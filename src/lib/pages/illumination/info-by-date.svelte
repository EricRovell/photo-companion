<script lang="ts">
	import { afterUpdate } from "svelte";
	import { GaugeTime, Bulb } from "../../components";
	import { ViewDate } from "../../layout";
	import { getScheduleStateByDate } from "../../services/schedule/schedule-by-date";
	import { currentYear } from "../../constants";
	import styles from "./info-by-date.module.css";

	const defaultState: ReturnType<typeof getScheduleStateByDate> = {
		timestampOn: NaN,
		timestampOff: NaN
	};

	let date: string = new Date().toISOString().substring(0, 10);
	let state: ReturnType<typeof getScheduleStateByDate> = defaultState;

	afterUpdate(() => {
		if (date) {
			state = getScheduleStateByDate(new Date(date).getTime());
		} else {
			state = defaultState
		}
	});
</script>

<section id="info-by-date" class="card {styles.root}">
	<header>
		<h2>Данные об освещении по датам</h2>
	</header>
	<ViewDate
		bind:date
		disabledPreviousControl="{new Date(date).getDate() === 1 && new Date(date).getMonth() === 0}"
		disabledNextControl="{new Date(date).getDate() === 31 && new Date(date).getMonth() === 11}"
		maxDate={`${currentYear}-12-31`}
		minDate={`${currentYear}-01-01`}
	>
		<GaugeTime
			timeFrom="{new Date(state?.timestampOn || "")}"
			timeTo="{new Date(state?.timestampOff || "")}"
		>
			<Bulb x="-10" y="-10" width="20" height="20" glow />
		</GaugeTime>
	</ViewDate>
</section>
