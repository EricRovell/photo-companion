<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { InputDatetime } from "@lib/components";
	import { getDateTimeString } from "@lib/helpers";
	import type { ComponentType } from "svelte";
	import styles from "./with-date.module.css";

	export let page: ComponentType;

	let date: string = ($query.date as string) ?? getDateTimeString();

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		date = target.value;
	};

	$: {
		$query.date = date;
		scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
</script>

<svelte:component this="{page}" {date} />
<InputDatetime
	className="{styles["date-input"]}"
	bind:value="{date}"
	on:change="{handleChange}"
/>
