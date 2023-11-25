<script lang="ts">
	import { fade } from "svelte/transition";
	import { query } from "svelte-pathfinder";
	import { Button, InputDatetime } from "@lib/components";
	import { getDateTimeString, isValidDate } from "@lib/helpers";
	import { parseQueryDate, createQueryDate } from "./with-date.helpers";
	import { dict } from "@lib/dict";
	import type { ComponentType } from "svelte";
	import styles from "./with-date.module.css";

	export let page: ComponentType;

	let value = parseQueryDate($query.date as string);
	let date = new Date(value);

	const handleClick = () => {
		const date = new Date();
		value = getDateTimeString(date);
		$query.date = createQueryDate(date);
	};

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
</script>

{#if isValidDate(date)}
	<svelte:component this="{page}" {date} />
{:else}
	<aside class="card {styles["error"]}" in:fade>
		<header>{dict["error"]}</header>
		<p>{dict["date-error-desc"]}:</p>
		<ul>
			<li>{dict["date-error-check-url"]} <strong>YYYY-MM-DD-hh-mm;</strong></li>
			<li>{dict["date-error-check-input"]};</li>
		</ul>
		<p>{dict["date-error-set-current-desc"]}:</p>
		<Button on:click="{handleClick}">
			{dict["date-error-set-current"]}
		</Button>
	</aside>
{/if}

<InputDatetime
	className="{styles["date-input"]}"
	on:datechange="{handleChange}"
	{value}
/>
