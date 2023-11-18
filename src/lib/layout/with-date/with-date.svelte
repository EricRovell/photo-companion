<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { InputDatetime } from "@lib/components";
	import { getDateTimeString } from "@lib/helpers";
	import { parseQueryDate, createQueryDate } from "./with-date.helpers";
	import type { ComponentType } from "svelte";
	import styles from "./with-date.module.css";

	export let page: ComponentType;

	let value = parseQueryDate($query.date as string) ?? getDateTimeString();
	let date = new Date(value);

	$: {
		date = new Date(value);
		$query.date = createQueryDate(date);
		scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
</script>

<svelte:component this="{page}" {date} />
<InputDatetime
	className="{styles["date-input"]}"
	bind:value
/>
