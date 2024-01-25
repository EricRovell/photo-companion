<script lang="ts">
	import { getNextBridgeEvent } from "bridge-schedule";
	import { Timer } from "@lib/components";
	import { dict } from "@lib/dict";
	import styles from "./bridges.module.css";

	let state = getNextBridgeEvent(new Date());
</script>

<article class="card {styles["next-event-info"]}">
	<header>
		<h2>{dict["closest-event"]}</h2>
	</header>
	<p>{!state.open ? "Развод" : "Сводка"} моста <span>{dict[state.name]}</span></p>
	<Timer
		timestamp={state.timestamp}
		on:alarm="{() => {
			state = getNextBridgeEvent(new Date());
		}}"
	/>
</article>
