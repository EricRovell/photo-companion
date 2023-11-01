<script lang="ts">
	import { afterUpdate } from "svelte";
	import { GaugeTime, Moon } from "../../components";
	import { ViewDate } from "../../layout";
	import { getMoonData } from "../../services/suncalc/moon";
	import { LAT, LON } from "../../constants";
	import styles from "./moon.module.css";

	const defaultState = {
		moonrise: new Date("null"),
		moonset: new Date("null"),
		phaseValue: 0,
		angle: 0,
		fraction: 0,
		waxing: false
	}

	let date: string = new Date().toISOString().substring(0, 10);
	let state: ReturnType<typeof getMoonData> = defaultState;

	const moonSize = 25;
	const moonPadding = 1;

	afterUpdate(() => {
		if (date) {
			state = getMoonData(new Date(date), LAT, LON);
		} else {
			state = defaultState;
		}
	});
</script>

<section id="ephemeris-moon" class="card {styles.root}">
	<header>
		<h2>Времена восхода и захода</h2>
	</header>
	<ViewDate bind:date>
		<GaugeTime
			timeFrom="{state.moonrise}"
			timeTo="{state.moonset}"
		>
			<foreignObject
				xmlns="http://www.w3.org/2000/svg"
				x="-{moonSize / 2 - moonPadding}"
				y="-{moonSize / 2 - moonPadding}"
				width="{moonSize + 2 * moonPadding}"
				height="{moonSize + 2 * moonPadding}"
				style="--moon-size: {moonSize - 2 * moonPadding}px"
			>
				<Moon
					phase="{state.phaseValue}"
					rotation="{state.angle}"
				/>
			</foreignObject>
		</GaugeTime>
	</ViewDate>
</section>
