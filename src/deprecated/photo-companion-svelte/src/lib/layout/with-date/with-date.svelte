<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { InputDatetime } from "ui";
	import { isValidDate } from "utils/validators";

	import ErrorDate from "../../../pages/error-date/error-date.svelte";
	import { parseQueryDate, createQueryDate } from "@lib/helpers";
	import { onMount } from "svelte";
	import styles from "./with-date.module.css";
	import { t } from "@stores/lang";

	let value = parseQueryDate($query.date as string);
	let date = new Date(value);

	const handleChange = (event: CustomEvent<{ value: string }>) => {
		date = new Date(event.detail.value);
		$query.date = createQueryDate(date);
	};

	query.hook(($updated) => {
		if (!$updated) {
			return false;
		}

		value = parseQueryDate($updated.date as string);
		date = new Date(value);
	});

	onMount(() => {
		if (!$query.date) {
			$query.date = createQueryDate();
		}
	});
</script>

{#if !isValidDate(date)}
	<ErrorDate />
{:else}
	<slot {date} />
{/if}

<InputDatetime
	className="{styles["date-input"]}"
	dict="{{
		DATETIME: $t.LABEL.DATETIME,
		NEXT_DAY: $t.LABEL.NEXT_DAY,
		PREVIOUS_DAY: $t.LABEL.PREVIOUS_DAY
	}}"
	on:datechange="{handleChange}"
	{value}
/>
