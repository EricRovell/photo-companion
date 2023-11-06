<script lang="ts">
	import { GaugeTime, Sun } from "@lib/components";
	import { ViewDate } from "@lib/layout";
	import { getSunData } from "@services/sun";
	import { LAT, LON } from "@lib/constants";
	import styles from "./sun.module.css";

	let date: string = new Date().toISOString().substring(0, 10);
	let state = getSunData(new Date(date), LAT, LON);

	const sunSize = 57;

	$: state = getSunData(new Date(date), LAT, LON);
</script>

<section id="sun" class="card {styles.root}">
	<header>
		<h2>Времена восхода и захода</h2>
	</header>
	<ViewDate bind:date>
		<GaugeTime
			timeFrom="{state.sunriseStart.value}"
			timeTo="{state.sunsetEnd.value}"
		>
			<Sun
				x="-{sunSize / 2}"
				y="-{sunSize / 2}"
				width="{sunSize}"
				height="{sunSize}"
			/>
		</GaugeTime>
	</ViewDate>
</section>
