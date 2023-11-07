<script lang="ts">
	import { Button, InputDate, InputDatetime } from "../../components";
	import { incrementDateByDay } from "../../helpers";
	import styles from "./view-date.module.css";

	export let date: string = new Date().toISOString();
	export let input: "date" | "date-time" = "date";

	const handleIncrement = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const value = Number(target.dataset.value) ?? 0;
		const nextDate = incrementDateByDay(date, value);

		date = nextDate.toISOString();
	};

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		date = target.value;
	};

	const handleDateReset = () => {
		date = new Date().toISOString();
	};
</script>

<div class="{styles.layout}">
	<Button
		aria-label="Предыдущий день"
		data-value="-1"
		disabled="{!date.length}"
		on:click={handleIncrement}
		title="Предыдущий день">
		<svg viewBox="0 0 256 256">
			<path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
		</svg>
	</Button>
	<slot />
	<Button
		aria-label="Следующий день"
		data-value="1"
		disabled="{!date.length}"
		on:click={handleIncrement}
		title="Следующий день"
	>
		<svg viewBox="0 0 256 256">
			<path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
		</svg>
	</Button>
	<form on:submit|preventDefault>
		{#if input === "date"}
			<InputDate
				aria-label="Выберите дату"
				on:change="{handleChange}"
				title="Выберите дату"
				value="{date}"
			/>
		{:else}
			<InputDatetime
				aria-label="Выберите дату и время"
				on:change="{handleChange}"
				title="Выберите дату и время"
				value="{date}"
			/>
		{/if}
		<Button on:click={handleDateReset}>
			Сейчас
		</Button>
	</form>
</div>
