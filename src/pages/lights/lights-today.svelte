<script lang="ts">
	import { Timer, Bulb } from "@lib/components";
	import { getLightsStateByDate } from "@services/lights";
	import type { ScheduleDataItem } from "@lib/types";
	import styles from "./lights-today.module.css";

	let state: ScheduleDataItem = getLightsStateByDate();

	const handleAlarm = () => {
		state = getLightsStateByDate();
	};

	$: messageSoon = state?.lights ? "выключено" : "включено";
</script>

<section class="card {styles.root}">
	<header>
		<h2>Сейчас</h2>
	</header>
	{#if !state}
		<p>Что-то пошло не так...</p>
	{:else}
		<Bulb 
			glow="{state.lights}"
		/>
		<p class="{styles.note}">
			Городское освещение будет <span class="{styles.state}" class:success={!state.lights} class:danger={state.lights}>{messageSoon}</span> через:
		</p>
		<Timer
			timestamp="{state?.timestamp}"
			on:alarm={handleAlarm}
		/>
	{/if}
</section>
