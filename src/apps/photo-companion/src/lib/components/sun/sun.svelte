<script lang="ts">
	import type { SunEventName } from "@shared/types";
	import styles from "./sun.module.css";

	export let color: string = "gold";
	export let event: SunEventName | "" = "";
	export let size = 100;
	export let radius = size / 2 - 5;

	let center = size / 2;

	switch (event) {
		case "NADIR":
			color = "hsl(240deg 0% 0%)";
			break;
		case "ASTRONOMICAL_DAWN":
			color = "#494582";
			break;
		case "NAUTICAL_DAWN":
			color = "#5756A6";
			break;
		case "BLUE_HOUR_START_DAWN":
			color = "#6167C9";
			break;
		case "GOLDEN_HOUR_START_DAWN":
			color = "#7A82E4";
			break;
		case "CIVIL_DAWN":
			color = "#9A9EEC";
			break;
		case "BLUE_HOUR_END_DAWN":
			color = "#B5B8F2";
			break;
		case "SUNRISE_START":
		case "SUNRISE_END":
			color = "#9C4438";
			break;
		case "GOLDEN_HOUR_END_DAWN":
			color = "#EC8F12";
			break;
		case "SOLAR_NOON":
			color = "gold";
			break;
		case "GOLDEN_HOUR_START_DUSK":
			color = "#EC8F12";
			break;
		case "SUNSET_START":
		case "SUNSET_END":
			color = "#9C4438";
			break;
		case "GOLDEN_HOUR_END_DUSK":
			color = "#9A9EEC";
			break;
		case "BLUE_HOUR_START_DUSK":
			color = "#7A82E4";
			break;
		case "CIVIL_DUSK":
			color = "#6167C9";
			break;
		case "BLUE_HOUR_END_DUSK":
			color = "#5756A6";
			break;
		case "NAUTICAL_DUSK":
			color = "#494582";
			break;
		case "ASTRONOMICAL_DUSK":
			color = "#38325D";
			break;
	}
</script>

<svg
	class="{styles.sun}"
	style="--sun-color: {color}"
	viewBox="0 0 {size} {size}"
	{...$$restProps}
>
	<circle
		cx="{center}"
		cy="{center}"
		r="{radius}"
	/>
</svg>
