<script lang="ts">
	//import ScheduleSparkline from "./card-bridge-sparkline.svelte";
	import Timer from "../timer/timer.svelte";
	import Icon from "../icon/icon.svelte";
	import { getBridgeStateByDate } from "@services/bridges";
	import { iconWarning } from "@lib/icons";
	import { dict } from "@lib/dict";
	import type { BridgeName } from "@lib/types";
	import styles from "./card-bridge.module.css";

	export let name: BridgeName;
	//export let schedule: BridgeShedule;
	export let exception = false;

	let state = getBridgeStateByDate(name, new Date(), true);
</script>

{#if state}
	<article class="{styles.card}">
		<header>
			<h2>{dict[name]} {dict["bridge"]}</h2>
			<output>
				{state.open
					? dict["bridge-opened"]
					: dict["bridge-closed"]}
			</output>
		</header>
		<div>
			<p>{state.open 
				? dict["bridge-till-closing"]
				: dict["bridge-till-opening"]}
			</p>
			<Timer
				timestamp={state.timestamp}
				on:alarm="{() => {
					state = getBridgeStateByDate(name, new Date(), true)
				}}"
			/>
		</div>
		<!-- <ScheduleSparkline
			{schedule}
		/> -->
		{#if exception}
			<footer>
				<p><Icon path="{iconWarning}" /> {dict["bridge-exception"]}</p>
			</footer>
		{/if}
	</article>
{/if}
