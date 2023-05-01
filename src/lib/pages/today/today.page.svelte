<script lang="ts">
	import { Timer } from "../../../lib/components";
	import { getScheduleState } from "../../core/get-schedule-state";
	import { scheduleData } from "../../core/transform-data";
	import styles from "./today.module.css";

	let state = getScheduleState(new Date().getTime(), scheduleData)!;

	const handleAlarm = () => {
		state = getScheduleState(new Date().getTime(), scheduleData)!;
	};

	$: messageNow = state.lights ? "включено" : "выключено";
	$: messageSoon = state.lights ? "выключено" : "включено";
</script>

<section id="today" class="{styles.root}">
	<h2>
		Сегодня
	</h2>
	<p>
		Городское освещение <span class="{styles.state}" class:active={state.lights}>{messageNow}</span>
	</p>
	<p class="{styles.note}">
		Городское освещение будет <span class="{styles.marked}" class:active={state.lights}>{messageSoon}</span> через
	</p>
	<Timer
		timestamp="{state?.timestamp}"
		on:alarm={handleAlarm}
	/>
</section>
