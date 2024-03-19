<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { incrementDateByDay } from "utils/date";

	import { getDatetimeString } from "./input-datetime.helpers";
	import { iconTimeline, iconChevronLeft, iconChevronRight } from "../../icons";
	import Button from "../button/button.svelte";
	import Icon from "../icon/icon.svelte";
	import styles from "./input-datetime.module.css";

	interface Dict {
		DATETIME: string;
		NEXT_DAY: string;
		PREVIOUS_DAY: string;
	}

	export let className = "";
	export let dict: Dict;
	export let max: Undefinable<string> = undefined;
	export let min: Undefinable<string> = undefined;
	export let title: Undefinable<string> = undefined;
	export let value = getDatetimeString();

	const dispatch = createEventDispatcher();

	const handleReset = () => {
		value = getDatetimeString();
		dispatch("datechange", { value });
	};

	const handleClick = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const step = Number(target.dataset.step);
		value = getDatetimeString(incrementDateByDay(value, step));
		dispatch("datechange", { value });
	};

	const handleChange = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		value = target.value;
		dispatch("datechange", { value });
	};
</script>

<form on:submit|preventDefault class="{styles.form} {className}">
	<Button
		className="{styles["button-increment"]}"
		data-step="-1"
		on:click="{handleClick}"
		title="{dict.NEXT_DAY}"
	>
		<Icon
			viewBox="0 0 256 256"
			path="{iconChevronLeft}" 
		/>
	</Button>
	<div class="{styles["input-wrapper"]}">
		<label class="{styles.label}">
			<slot />
			<input
				aria-label="{dict.DATETIME}"
				class="{styles.input}"
				{max}
				{min}
				on:change="{handleChange}"
				{title}
				type="datetime-local"
				{value}
				{...$$restProps}
			/>
		</label>
		<Button
			className="{styles.button}"
			on:click="{handleReset}"
			title="Сейчас"
		>
			<Icon path="{iconTimeline}" />
		</Button>
	</div>
	<Button
		className="{styles["button-increment"]}"
		data-step="1"
		on:click="{handleClick}"
		title="{dict.PREVIOUS_DAY}"
	>
		<Icon
			viewBox="0 0 256 256"
			path="{iconChevronRight}"
		/>
	</Button>
</form>
