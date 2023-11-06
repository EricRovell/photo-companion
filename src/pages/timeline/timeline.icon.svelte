<script lang="ts">
	import { Bulb, Icon } from "@lib/components";
	import { iconMoonrise, iconMoonset, iconSunrise, iconSunset } from "@lib/icons";
	import type { ComponentType } from "svelte";
	import type { EventName } from "@lib/types";

	export let eventName: EventName;

	interface IconData {
		component: ComponentType;
		props: Record<string, unknown>;
	}

	const data: Partial<Record<EventName, IconData>> = {
		"lights:start": {
			component: Bulb,
			props: {
				glow: true
			}
		},
		"lights:end": {
			component: Bulb,
			props: {}
		},
		"sunrise": {
			component: Icon,
			props: {
				path: iconSunrise,
				viewBox: "0 0 24 24",
				stroke: "yellow",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				fill: "none"
			}
		},
		"sunset": {
			component: Icon,
			props: {
				path: iconSunset,
				viewBox: "0 0 24 24",
				stroke: "yellow",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				fill: "none"
			}
		},
		"moonrise": {
			component: Icon,
			props: {
				path: iconMoonrise,
				viewBox: "0 0 24 24",
				stroke: "white",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				fill: "none"
			}
		},
		"moonset": {
			component: Icon,
			props: {
				path: iconMoonset,
				viewBox: "0 0 24 24",
				stroke: "white",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				fill: "none"
			}
		}
	};
</script>

<svelte:component
	this="{data[eventName]?.component}"
	{...data[eventName]?.props}
/>
