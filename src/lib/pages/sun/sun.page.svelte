<script lang="ts">
	import { afterUpdate } from "svelte";
	import { GaugeTime, Sun } from "../../components";
	import { ViewDate } from "../../layout";
	import { getSunData } from "../../services/suncalc/sun";
	import { LAT, LON } from "../../constants";
	import styles from "./sun.module.css";

	let date: string = new Date().toISOString().substring(0, 10);
	let state: ReturnType<typeof getSunData>;
	const sunSize = 57;

	afterUpdate(() => {
		state = getSunData(new Date(date), LAT, LON);
	});
</script>

<section id="ephemeris-sun" class="card {styles.root}">
	<header>
		<h2>Времена восхода и захода</h2>
	</header>
	{#if state}
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
	{/if}
</section>
