<script lang="ts">
	import { GaugeTime, Sun } from "@lib/components";
	import { getSunData } from "@services/sun";
	import { dict } from "@lib/dict";
	import { LAT, LON } from "@lib/constants";
	import styles from "./sun.module.css";

	export let date: Date;

	let state: ReturnType<typeof getSunData> = getSunData(date, LAT, LON);

	const sunSize = 30;

	$: state = getSunData(date, LAT, LON);
</script>

<section id="sun" class="card {styles.root}">
	<header>
		<h2>{dict["header-sun-moontimes"]}</h2>
	</header>
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
</section>
