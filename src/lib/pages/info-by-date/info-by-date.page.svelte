<script lang="ts">
	import { afterUpdate } from "svelte";
	import { Bulb, Gauge, Button } from "../../components";
	import { getScheduleStateByDate } from "../../core/get-schedule-by-date";
	import { currentYear } from "../../constants";
	import { formatTime, getAngleFromTime, validateDate } from "../../helpers";
	import styles from "./info-by-date.module.css";

	let userInput: string = new Date().toISOString().substring(0, 10);
	let state;

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		userInput = target.value;
	};

	const handleIncrement = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const value = Number(target.dataset.value) ?? 0;
		const date = new Date(userInput);
		const nextDate = new Date(date.getTime());
		nextDate.setDate(nextDate.getDate() + value);

		if (validateDate(nextDate)) {
			userInput = nextDate.toISOString().substring(0, 10);
		}
	};

	afterUpdate(() => {
		state = getScheduleStateByDate(new Date(userInput).getTime());
	});
</script>

<section id="info-by-date" class="card {styles.root}">
	<header>
		<h2>Данные об освещении по датам</h2>
	</header>
	{#if state}
		<div class="{styles.state}">
			<Button
				aria-label="Предыдущий день"
				data-value="-1"
				disabled={new Date(userInput).getDate() === 1 && new Date(userInput).getMonth() === 0}
				on:click={handleIncrement}
				title="Предыдущий день">
				<svg viewBox="0 0 256 256">
					<path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
				</svg>
			</Button>
			<Gauge
				angleStart="{getAngleFromTime(new Date(state.timestampOn))}"
				angleEnd="{getAngleFromTime(new Date(state.timestampOff))}"
				labelStart="{formatTime(state.timestampOn)}"
				labelEnd="{formatTime(state.timestampOff)}"
			>
				<Bulb x="-10" y="-10" width="20" height="20" glow />
			</Gauge>
			<Button
				aria-label="Следующий день"
				data-value="1"
				disabled={new Date(userInput).getDate() === 31 && new Date(userInput).getMonth() === 11}
				on:click={handleIncrement}
				title="Следующий день"
			>
				<svg viewBox="0 0 256 256">
					<path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
				</svg>
			</Button>
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
			aria-label="Выберите дату"
			title="Выберите дату"
		/>
	</label>
</section>
