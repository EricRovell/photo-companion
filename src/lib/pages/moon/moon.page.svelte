<script lang="ts">
	import { afterUpdate } from "svelte";
	import { GaugeTime, Moon } from "../../components";
	import { ViewDate } from "../../layout";
	import { getMoonData } from "../../services/suncalc/moon";
	import { LAT, LON } from "../../constants";
	import styles from "./moon.module.css";

	let date: string = new Date().toISOString().substring(0, 10);
	let state: ReturnType<typeof getMoonData>;

	const moonSize = 20;

	afterUpdate(() => {
		state = getMoonData(new Date(date), LAT, LON);
	});
</script>

<section id="ephemeris-moon" class="card {styles.root}">
	<header>
		<h2>Времена восхода и захода</h2>
	</header>
	{#if state}
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
					style="--moon-size: {moonSize}px"
				>
					<Moon
						phase="{state.phaseValue}"
						rotation="{state.angle}"
					/>
				</foreignObject>
			</GaugeTime>
		</ViewDate>
	{/if}
</section>
