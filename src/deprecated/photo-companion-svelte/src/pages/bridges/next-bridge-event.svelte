<script lang="ts">
	import { getNextBridgeEvent } from "bridge-schedule";
	import { TimerDigits } from "@lib/components";
	import { t } from "@stores/lang";
	import styles from "./bridges.module.css";

	let state = getNextBridgeEvent(new Date());
</script>

<article class="card {styles["next-event-info"]}">
	<header>
		<h2>{$t.TITLE.THE_CLOSEST_EVENT}</h2>
	</header>
	<p>
		{$t.BRIDGE_SPB_EVENTS[`${state.name}_${!state.open ? "OPEN" : "CLOSE"}`]}
	</p>
	<TimerDigits
		timestamp={state.timestamp}
		on:alarm="{() => {
			state = getNextBridgeEvent(new Date());
		}}"
	/>
</article>
