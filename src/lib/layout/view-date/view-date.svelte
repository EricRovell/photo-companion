<script lang="ts">
	import { Button, InputDate } from "../../components";
	import { incrementDateByDay } from "../../helpers";
	import styles from "./view-date.module.css";

	export let date: string = new Date().toISOString().substring(0, 10);
	export let disabledPreviousControl = false;
	export let disabledNextControl = false;
	export let maxDate: string | undefined = undefined;
	export let minDate: string | undefined = undefined;

	const handleIncrement = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const value = Number(target.dataset.value) ?? 0;
		const nextDate = incrementDateByDay(date, value)

		date = nextDate.toISOString().substring(0, 10);
	};

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		date = target.value;
	};

	const handleDateReset = () => {
		date = new Date().toISOString().substring(0, 10);
	};
</script>

<div class="{styles.layout}">
	<Button
		aria-label="Предыдущий день"
		data-value="-1"
		disabled="{disabledPreviousControl}"
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
		disabled="{disabledNextControl}"
		on:click={handleIncrement}
		title="Следующий день"
	>
		<svg viewBox="0 0 256 256">
			<path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
		</svg>
	</Button>
	<form on:submit|preventDefault>
		<InputDate
			aria-label="Выберите дату"
			max="{maxDate}"
			min="{minDate}"
			on:change="{handleChange}"
			title="Выберите дату"
			value="{date}"
		/>
		<Button on:click={handleDateReset}>
			Сегодня
		</Button>
	</form>
</div>
