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
	<header>{dict.TITLE.ERROR}</header>
	<p>{dict.MESSAGE.WRONG_DATE}:</p>
	<ul>
		<li>{dict.MESSAGE.WRONG_DATE_URL} <strong>YYYY-MM-DD-hh-mm;</strong></li>
		<li>{dict.MESSAGE.CHECK_DATE_INPUT};</li>
	</ul>
	<p>{dict.MESSAGE.SET_CURRENT_DATE_ADVICE}:</p>
	<Button on:click="{handleClick}">
		{dict.MESSAGE.SET_CURRENT_DATETIME}
	</Button>
</aside>
