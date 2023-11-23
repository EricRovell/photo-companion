<script lang="ts">
	import { Timer, Bulb, GaugeTime } from "@lib/components";
	import { getLightsScheduleByDate, getLightsStateByDate } from "@services/lights";
	import { dict, template } from "@lib/dict";
	import styles from "./lights.module.css";

	export let date: Date;

	let schedule = getLightsScheduleByDate(date);
	let state = getLightsStateByDate();

	const handleAlarm = () => {
		state = getLightsStateByDate();
	};

	$: schedule = getLightsScheduleByDate(date);
</script>

<div class="{styles.page}">
	<section data-label="lights-schedule" class="card">
		<header>
			<h2>{dict["header-lights-by-date"]}</h2>
		</header>
		<GaugeTime
			timeFrom="{new Date(schedule["lights:start"])}"
			timeTo="{new Date(schedule["lights:end"])}"
		>
			<Bulb x="-10" y="-10" width="20" height="20" glow />
		</GaugeTime>
	</section>
	<section
		data-active="{state.lights ? "" : undefined}"
		data-label="lights-event-timer"
		class="card"
	>
		<header>
			<h2>{dict["header-lights-timer"]}</h2>
		</header>
		{#if !state}
			<p>{dict["something-wrong"]}</p>
		{:else}
			<Bulb 
				glow="{state.lights}"
			/>
			<p class="{styles.note}">
				{@html template["lights-event"](state.lights)}
			</p>
			<Timer
				timestamp="{state.timestamp}"
				on:alarm={handleAlarm}
			/>
		{/if}
	</section>
</div>
