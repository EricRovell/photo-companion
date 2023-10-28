<script lang="ts">
	import { Timer, Bulb } from "../../components";
	import { getScheduleState } from "../../services/schedule";
	import type { ScheduleDataItem } from "../../../types";
	import styles from "./today.module.css";

	let state: ScheduleDataItem | null = getScheduleState(new Date().getTime());

	const handleAlarm = () => {
		state = getScheduleState(new Date().getTime());
	};

	$: messageSoon = state?.lights ? "выключено" : "включено";
</script>

<section id="today" class="card {styles.root}">
	<header>
		<h2>
			Сейчас
		</h2>
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
