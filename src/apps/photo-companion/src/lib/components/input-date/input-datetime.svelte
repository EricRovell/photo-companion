<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Button from "../button/button.svelte";
	import Icon from "../icon/icon.svelte";
	import { iconTimeline, iconChevronLeft, iconChevronRight } from "@lib/icons";
	import { getDateTimeString } from "@lib/helpers";
	import { incrementDateByDay } from "@shared/utils";
	import { dict } from "@lib/dict";
	import styles from "./input-datetime.module.css";

	export let className = "";
	export let max: string | undefined = undefined;
	export let min: string | undefined = undefined;
	export let title: string | undefined = undefined;
	export let value = getDateTimeString();

	const dispatch = createEventDispatcher();

	const handleReset = () => {
		value = getDateTimeString();
		dispatch("datechange", { value });
	};

	const handleClick = (event: Event) => {
		const target = event.target as HTMLButtonElement;
		const step = Number(target.dataset.step);
		value = getDateTimeString(incrementDateByDay(value, step));
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
		title="{dict.LABEL.NEXT_DAY}"
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
				aria-label="{dict.LABEL.DATETIME}"
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
		title="{dict.LABEL.PREVIOUS_DAY}"
	>
		<Icon
			viewBox="0 0 256 256"
			path="{iconChevronRight}"
		/>
	</Button>
</form>
