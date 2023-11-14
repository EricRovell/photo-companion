<script lang="ts">
	import type { SunEventName } from "@lib/types";
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
		case "dawn:astronomical":
			color = "#494582";
			break;
		case "dawn:nautical":
			color = "#5756A6";
			break;
		case "dawn:blue-hour:start":
			color = "#6167C9";
			break;
		case "dawn:golden-hour:start":
			color = "#7A82E4";
			break;
		case "dawn:civil":
			color = "#9A9EEC";
			break;
		case "dawn:blue-hour:end":
			color = "#B5B8F2";
			break;
		case "sunrise:start":
		case "sunrise:end":
			color = "#9C4438";
			break;
		case "dawn:golden-hour:end":
			color = "#EC8F12";
			break;
		case "solar-noon":
			color = "gold";
			break;
		case "dusk:golden-hour:start":
			color = "#EC8F12";
			break;
		case "sunset:start":
		case "sunset:end":
		color = "#9C4438";
				break;
		case "dusk:golden-hour:end":
			color = "#9A9EEC";
			break;
		case "dusk:blue-hour:start":
			color = "#7A82E4";
			break;
		case "dusk:civil":
			color = "#6167C9";
			break;
		case "dusk:blue-hour:end":
			color = "#5756A6";
			break;
		case "dusk:nautical":
			color = "#494582";
			break;
		case "dusk:astronomical":
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
