<script lang="ts">
	import { Bulb, Icon } from "../../components";
	import { iconMoonrise, iconMoonset, iconSunrise, iconSunset } from "../../icons";
	import type { ComponentType } from "svelte";
	import type { EventName } from "../../types";
	import styles from "./timeline.module.css";

	export let eventName: EventName;

	interface IconData {
		label: string;
		icon: ComponentType;
		props: Record<string, unknown>;
	}

	const data: Record<EventName, IconData> = {
		"lights-on": {
			label: "Включение городской подсветки",
			icon: Bulb,
			props: {
				glow: true
			}
		},
		"lights-off": {
			label: "Отключение городской подсветки",
			icon: Bulb,
			props: {}
		},
		"sunrise": {
			label: "Восход Солнца",
			icon: Icon,
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
			label: "Заход Солнца",
			icon: Icon,
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
			label: "Восход Луны",
			icon: Icon,
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
			label: "Заход Луны",
			icon: Icon,
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


<div class="{styles.icon}">
	<svelte:component
		this="{data[eventName].icon}"
		{...data[eventName].props}
	/>
</div>
<p>{data[eventName].label}</p>
