<script lang="ts">
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

<section id="info-by-date" class="{styles.root}">
	<h2>
		По дате
	</h2>
	<label class="{styles["date-input"]}">
		<input
			type="date"
			value="{userInput}"
			min={`${currentYear}-01-01`}
			max={`${currentYear}-12-31`}
			on:change="{handleChange}"
		/>
	</label>
	{#if state}
		<div class="{styles.state}">
			<p>
				<output lang="en">
					{formatDate(state.timestampOff)}
				</output>
				<span>Выключение</span>
			</p>
			<p>
				<output lang="en">
					{formatDate(state.timestampOn)}
				</output>
				<span>Включение</span>
			</p>
		</div>
	{:else}
		<p>Что-то пошло не так: нет данных</p>
	{/if}
</section>
