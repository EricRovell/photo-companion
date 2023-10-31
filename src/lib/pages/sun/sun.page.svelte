<script lang="ts">
	import { afterUpdate } from "svelte";
	import { Gauge, Sun } from "../../components";
	import { ViewDate } from "../../layout";
	import { calcEphemeridesData } from "../../services/suncalc";
	import { LAT, LON } from "../../constants";
	import styles from "./sun.module.css";

	let date: string = new Date().toISOString().substring(0, 10);
	let state: ReturnType<typeof calcEphemeridesData>;

	afterUpdate(() => {
		state = calcEphemeridesData(new Date(date), LAT, LON);
	});

	let sunSize = 43;
</script>

<section id="ephemeris-sun" class="card {styles.root}">
	<header>
		<h2>Времена восхода и захода</h2>
	</header>
	{#if state}
		<ViewDate bind:date>
			<Gauge
				angleStart={state.sunrise.angle}
				labelStart="{state.sunrise.time}"
				angleEnd={state.sunset.angle}
				labelEnd="{state.sunset.time}"
			>
				<Sun
					x="-{sunSize / 2}"
					y="-{sunSize / 2}"
					width="{sunSize}"
					height="{sunSize}"
				/>
			</Gauge>
		</ViewDate>
	{/if}
</section>
