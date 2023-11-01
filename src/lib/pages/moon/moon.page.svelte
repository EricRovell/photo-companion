<script lang="ts">
	import { tweened } from "svelte/motion";
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
	};

	let date: string = new Date().toISOString().substring(0, 10);
	let state: ReturnType<typeof getMoonData> = defaultState;
	let phase = tweened(state.phaseValue);

	const moonSize = 35;

	$: {
		if (date) {
			state = getMoonData(new Date(date), LAT, LON);
		} else {
			state = defaultState;
		}
	}

	$: {
		void phase.set(state.phaseValue);
	}
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
				x="-{moonSize / 2}"
				y="-{moonSize / 2}"
				width="{moonSize}"
				height="{moonSize}"
			>
				<Moon
					phase="{$phase}"
					rotation="{state.angle}"
					size="{moonSize}"
				/>
			</foreignObject>
		</GaugeTime>
	</ViewDate>
</section>
