<script lang="ts">
	import Button from "../button/button.svelte";
	import Icon from "../icon.svelte";
	import { iconTimeline, iconChevronLeft, iconChevronRight } from "@lib/icons";
	import { getDateTimeString, incrementDateByDay } from "@lib/helpers";
	import styles from "./input-datetime.module.css";

	export let className = "";
	export let max: string | undefined = undefined;
	export let min: string | undefined = undefined;
	export let title: string | undefined = undefined;
	export let value: string = new Date().toISOString();

	const handleReset = () => {
		value = getDateTimeString();
	};

	function handleClick(event: Event) {
		const target = event.target as HTMLButtonElement;
		const step = Number(target.dataset.step);
		const nextDate = incrementDateByDay(new Date(value), step);
		value = getDateTimeString(nextDate);
	};

	$: inputValue = value.substring(0, 16);
</script>

<form on:submit|preventDefault class="{styles.form} {className}">
	<Button
		className="{styles["button-increment"]}"
		data-step="-1"
		on:click="{handleClick}"
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
				class="{styles.input}"
				{max}
				{min}
				on:change
				{title}
				type="datetime-local"
				value="{inputValue}"
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
		data-step="-1"
		on:click="{handleClick}"
	>
		<Icon
			viewBox="0 0 256 256"
			path="{iconChevronRight}"
		/>
	</Button>
</form>
