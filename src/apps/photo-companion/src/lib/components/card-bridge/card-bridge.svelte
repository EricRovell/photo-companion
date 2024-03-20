<script lang="ts">
	import { getBridgeState, getBridgeScheduleEntry } from "bridge-schedule";
	import { Icon } from "ui";
	import { iconWarning } from "ui/icons";
	import type { BridgeName } from "types";

	import ScheduleSparkline from "./card-bridge-sparkline.svelte";
	import { TimerDigits } from "@lib/components";
	import { dict } from "@lib/dict";
	import styles from "./card-bridge.module.css";

	export let name: BridgeName;
	export let exception = false;
	
	let schedule = getBridgeScheduleEntry(name);
	let state = getBridgeState(name, new Date(), true);
</script>

{#if state}
	<article class="{styles.card}">
		<header>
			<h2>
				{dict.BRIDGE_NAME_SPB[name]} {dict.LABEL.BRIDGE}
				{#if exception}
				<Icon
					path="{iconWarning}"
					title="{dict.MESSAGE.BRIDGE_EXCEPTION}"
				/>
		{/if}
			</h2>
			<output>
				{
					state.open
						? dict.LABEL.BRIDGE_OPENED
						: dict.LABEL.BRIDGE_CLOSED
				}
			</output>
		</header>
		<div>
			
		</div>
		<ScheduleSparkline
			{schedule}
		/>
		<footer>
			<p>{
				state.open
					? dict.MESSAGE.BRIDGE_WILL_CLOSE_WITHIN
					: dict.MESSAGE.BRIDGE_WILL_OPEN_WITHIN
				}
			</p>
			<TimerDigits
				timestamp={state.timestamp}
				on:alarm="{() => {
					state = getBridgeState(name, new Date(), true);
				}}"
			/>
		</footer>
	</article>
{/if}
