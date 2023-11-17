<script lang="ts">
	import { GaugeTime, Sun } from "@lib/components";
	import { getSunData } from "@services/sun";
	import { LAT, LON } from "@lib/constants";
	import styles from "./sun.module.css";
	import { afterUpdate } from "svelte";

	export let date = new Date().getTime();
	let state: ReturnType<typeof getSunData> = getSunData(new Date(date), LAT, LON);

	const sunSize = 30;

	afterUpdate(() => {
		state = getSunData(new Date(date), LAT, LON);
	});
</script>

<section id="sun" class="card {styles.root}">
	<header>
		<h2>Времена восхода и захода</h2>
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
