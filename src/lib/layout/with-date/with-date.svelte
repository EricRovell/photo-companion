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

	$: {
		date = new Date(value);
		$query.date = createQueryDate(date);
		scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
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
	bind:value
/>
