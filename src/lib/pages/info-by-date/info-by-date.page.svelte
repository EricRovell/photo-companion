<script lang="ts">
	import { Bulb } from "../../components";
	import { getScheduleStateByDate } from "../../core/get-schedule-by-date";
	import { currentYear } from "../../constants";
	import styles from "./info-by-date.module.css";

	let userInput: string = new Date().toISOString().substring(0, 10);
	let state = getScheduleStateByDate(new Date(userInput).getTime());

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		userInput = target.value;
		state = getScheduleStateByDate(new Date(userInput).getTime());
	};

	const formatDate = (timestamp: number) => {
		return Intl.DateTimeFormat("ru-RU", {
			hour: "numeric",
			minute: "numeric"
		}).format(timestamp);
	};
</script>

<section id="info-by-date" class="card {styles.root}">
	<header>
		<h2>
			Данные об освещении по датам
		</h2>
	</header>
	{#if state}
		<ol class="{styles.time}">
			<li class="{styles.wire}" />
			<li class="{styles.bulb}">
				<Bulb
					title="Выключение"
				/>
				<time
					lang="en"
					datetime="{new Date(state.timestampOff).toISOString()}"
				>
					{formatDate(state.timestampOff)}
				</time>
			</li>
			<li class="{styles.wire}" />
			<li class="{styles.bulb}">
				<Bulb
					glow="{true}"
					title="Включение"
				/>
				<time
					lang="en"
					datetime="{new Date(state.timestampOff).toISOString()}"
				>
					{formatDate(state.timestampOn)}
				</time>
			</li>
			<li class="{styles.wire}" />
		</ol>
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
