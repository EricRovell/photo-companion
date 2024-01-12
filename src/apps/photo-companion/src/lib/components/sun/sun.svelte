<script lang="ts">
	import type { SunEventName } from "@shared/types";
	import styles from "./sun.module.css";

	export let color: string = "gold";
	export let event: SunEventName | "" = "";
	export let size = 100;
	export let radius = size / 2 - 5;

	let center = size / 2;

	switch (event) {
		case "nadir":
			color = "hsl(240deg 0% 0%)";
			break;
		case "astronomical:dawn":
			color = "#494582";
			break;
		case "nautical:dawn":
			color = "#5756A6";
			break;
		case "blue-hour:dawn:start":
			color = "#6167C9";
			break;
		case "golden-hour:dawn:start":
			color = "#7A82E4";
			break;
		case "civil:dawn":
			color = "#9A9EEC";
			break;
		case "blue-hour:dawn:end":
			color = "#B5B8F2";
			break;
		case "sunrise:start":
		case "sunrise:end":
			color = "#9C4438";
			break;
		case "golden-hour:dawn:end":
			color = "#EC8F12";
			break;
		case "solar-noon":
			color = "gold";
			break;
		case "golden-hour:dusk:start":
			color = "#EC8F12";
			break;
		case "sunset:start":
		case "sunset:end":
			color = "#9C4438";
			break;
		case "golden-hour:dusk:end":
			color = "#9A9EEC";
			break;
		case "blue-hour:dusk:start":
			color = "#7A82E4";
			break;
		case "civil:dusk":
			color = "#6167C9";
			break;
		case "blue-hour:dusk:end":
			color = "#5756A6";
			break;
		case "nautical:dusk":
			color = "#494582";
			break;
		case "astronomical:dusk":
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
