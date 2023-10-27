<script lang="ts">
	import { Bulb, Gauge } from "../../components";
	import { getScheduleStateByDate } from "../../core/get-schedule-by-date";
	import { currentYear } from "../../constants";
	import { formatTime, getAngleFromTime } from "../../helpers";
	import styles from "./info-by-date.module.css";

	let userInput: string = new Date().toISOString().substring(0, 10);
	let state = getScheduleStateByDate(new Date(userInput).getTime());

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		userInput = target.value;
		state = getScheduleStateByDate(new Date(userInput).getTime());
	};
</script>

<section id="info-by-date" class="card {styles.root}">
	<header>
		<h2>Данные об освещении по датам</h2>
	</header>
	{#if state}
		<div class="{styles.state}">
			<Gauge
				angleStart="{getAngleFromTime(new Date(state.timestampOn))}"
				angleEnd="{getAngleFromTime(new Date(state.timestampOff))}"
				labelStart="{formatTime(state.timestampOn)}"
				labelEnd="{formatTime(state.timestampOff)}"
			>
				<Bulb x="-10" y="-10" width="20" height="20" glow />
			</Gauge>
		</div>
	{:else}
		<p>Пожалуйста, введите дату для отображения данных.</p>
	{/if}
	<label class="{styles["date-input"]}">
		<input
			type="date"
			value="{userInput}"
			min={`${currentYear}-01-01`}
			max={`${currentYear}-12-31`}
			on:change="{handleChange}"
		/>
		<span>Введите дату</span>
	</label>
</section>
