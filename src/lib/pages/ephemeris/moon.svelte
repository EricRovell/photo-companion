<script lang="ts">
	import { afterUpdate } from "svelte";
	import { Gauge } from "../../components";
	import { ViewDate } from "../../layout";
	import { calcEphemeridesData, calcMoonIllumination } from "../../services/suncalc";
	import { LAT, LON } from "../../constants";
	import styles from "./ephemeris.module.css";

	let date: string = new Date().toISOString().substring(0, 10);
	let state: ReturnType<typeof calcEphemeridesData>;

	afterUpdate(() => {
		state = calcEphemeridesData(new Date(date), LAT, LON);
	});
</script>

<section id="ephemeris-moon" class="card {styles.root}">
	<header>
		<h2>Луна</h2>
	</header>
	{#if state}
		<ViewDate bind:date>
			<Gauge
				angleStart={state.moonrise.angle}
				labelStart="{state.moonrise.time}"
				angleEnd={state.moonset.angle}
				labelEnd="{state.moonset.time}"
			>
				<text x="0" y="0" dominant-baseline="central">
					Moon, {calcMoonIllumination()}%
				</text>
			</Gauge>
		</ViewDate>
	{/if}
</section>
