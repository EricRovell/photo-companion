<script lang="ts">
	import { query } from "svelte-pathfinder";
	import ErrorDate from "../../../pages/error-date/error-date.svelte";
	import { InputDatetime } from "@lib/components";
	import { isValidDate, parseQueryDate, createQueryDate } from "@lib/helpers";
	import { onMount, type ComponentType } from "svelte";
	import styles from "./with-date.module.css";

	export let page: ComponentType;

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
	<svelte:component
		{date}
		this="{page}"
	/>
{/if}

<InputDatetime
	className="{styles["date-input"]}"
	on:datechange="{handleChange}"
	{value}
/>
