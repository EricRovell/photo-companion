<script lang="ts">
	import ScheduleSparkline from "./card-bridge-sparkline.svelte";
	import Timer from "../timer/timer.svelte";
	import Icon from "../icon/icon.svelte";
	import { getBridgeStateByDate, getBridgeSchedule } from "@services/bridges";
	import { iconWarning } from "@lib/icons";
	import { dict, template } from "@lib/dict";
	import type { BridgeName, BridgeShedule } from "@lib/types";
	import styles from "./card-bridge.module.css";

	export let name: BridgeName;
	export let exception = false;
	
	let schedule: BridgeShedule = getBridgeSchedule(name);
	let state = getBridgeStateByDate(name, new Date(), true);
</script>

{#if state}
	<article class="{styles.card}">
		<header>
			<h2>
				{dict[name]} {dict["bridge"]}
				{#if exception}
				<Icon
					path="{iconWarning}"
					title="{dict["bridge-exception"]}"
				/>
		{/if}
			</h2>
			<output>
				{state.open
					? dict["bridge-opened"]
					: dict["bridge-closed"]}
			</output>
		</header>
		<div>
			
		</div>
		<ScheduleSparkline
			{schedule}
		/>
		<footer>
			<p>{template["bridge-next-event"](state.open)}</p>
			<Timer
				timestamp={state.timestamp}
				on:alarm="{() => {
					state = getBridgeStateByDate(name, new Date(), true)
				}}"
			/>
		</footer>
	</article>
{/if}
