<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { Button } from "@lib/components";
	import { createQueryDate } from "@lib/helpers";
	import { dict } from "@lib/dict";
	import styles from "./error-date.module.css";

	const handleClick = () => {
		$query.date = createQueryDate(new Date());
	};
</script>

<aside class="card {styles["error"]}">
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
