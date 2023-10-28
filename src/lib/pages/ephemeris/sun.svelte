<script lang="ts">
	import { afterUpdate } from "svelte";
	import { Gauge } from "../../components";
	import { ViewDate } from "../../layout";
	import { calcEphemeridesData } from "../../services/suncalc";
	import { LAT, LON } from "../../constants";
	import styles from "./ephemeris.module.css";

	let date: string = new Date().toISOString().substring(0, 10);
	let state: ReturnType<typeof calcEphemeridesData>;

	afterUpdate(() => {
		state = calcEphemeridesData(new Date(date), LAT, LON);
	});
</script>

<section id="ephemeris-sun" class="card {styles.root}">
	<header>
		<h2>Солнце</h2>
	</header>
	{#if state}
		<ViewDate bind:date>
			<Gauge
				angleStart={state.sunrise.angle}
				labelStart="{state.sunrise.time}"
				angleEnd={state.sunset.angle}
				labelEnd="{state.sunset.time}"
			>
				<text x="0" y="0" dominant-baseline="central">
					Sun
				</text>
			</Gauge>
		</ViewDate>
	{/if}
</section>
