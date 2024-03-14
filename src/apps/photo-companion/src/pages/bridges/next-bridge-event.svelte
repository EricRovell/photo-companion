<script lang="ts">
	import { getNextBridgeEvent } from "bridge-schedule";
	import { TimerDigits } from "@lib/components";
	import { dict } from "@lib/dict";
	import styles from "./bridges.module.css";

	let state = getNextBridgeEvent(new Date());
</script>

<article class="card {styles["next-event-info"]}">
	<header>
		<h2>{dict.TITLE.THE_CLOSEST_EVENT}</h2>
	</header>
	<p>{!state.open ? "Развод" : "Сводка"} моста <span>{dict.BRIDGE_NAME_SPB[state.name]}</span></p>
	<TimerDigits
		timestamp={state.timestamp}
		on:alarm="{() => {
			state = getNextBridgeEvent(new Date());
		}}"
	/>
</article>
