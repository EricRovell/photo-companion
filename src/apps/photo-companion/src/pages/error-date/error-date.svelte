<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { Button } from "ui";
	import { createQueryDate } from "@lib/helpers";
	import { t } from "@stores/lang";
	import styles from "./error-date.module.css";

	const handleClick = () => {
		$query.date = createQueryDate(new Date());
	};
</script>

<aside class="card {styles["error"]}">
	<header>{$t.TITLE.ERROR}</header>
	<p>{$t.MESSAGE.WRONG_DATE}:</p>
	<ul>
		<li>{$t.MESSAGE.WRONG_DATE_URL} <strong>YYYY-MM-DD-hh-mm;</strong></li>
		<li>{$t.MESSAGE.CHECK_DATE_INPUT};</li>
	</ul>
	<p>{$t.MESSAGE.SET_CURRENT_DATE_ADVICE}:</p>
	<Button on:click="{handleClick}">
		{$t.MESSAGE.SET_CURRENT_DATETIME}
	</Button>
</aside>
