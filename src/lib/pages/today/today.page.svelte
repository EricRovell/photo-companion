<script lang="ts">
	import { Timer, Bulb } from "../../../lib/components";
	import { getScheduleState } from "../../core/get-schedule-state";
	import type { ScheduleDataItem } from "../../../types";
	import styles from "./today.module.css";

	let state: ScheduleDataItem | null = getScheduleState(new Date().getTime());

	const handleAlarm = () => {
		state = getScheduleState(new Date().getTime());
	};

	$: messageNow = state?.lights ? "включено" : "выключено";
	$: messageSoon = state?.lights ? "выключено" : "включено";
</script>

<section id="today" class="{styles.root}">
	<header>
		<h2>
			Сейчас
		</h2>
	</header>
	<Bulb 
		glow="{state.lights}"
	/>
	<p>
		Городское освещение <span class="{styles.state}" class:active={state.lights}>{messageNow}</span>
	</p>
</section>

<section id="today" class="{styles.root}">
	<header>
		<h2>
			Отсчёт
		</h2>
	</header>
	<p class="{styles.note}">
		Городское освещение будет <span class="{styles.state}" class:active={state.lights}>{messageSoon}</span> через:
	</p>
	<Timer
		timestamp="{state?.timestamp}"
		on:alarm={handleAlarm}
	/>
</section>
