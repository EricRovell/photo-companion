<script lang="ts">
	import { GaugeTime, Moon, Datetime } from "@lib/components";
	import { getMoonData } from "@services/moon";
	import { LAT, LON } from "@lib/constants";
	import styles from "./moon.module.css";

	export let date: Date;

	const moonSize = 48;
	let state = getMoonData(date, LAT, LON);

	$: state = getMoonData(date, LAT, LON);
</script>

<section id="ephemeris-moon" class="card {styles.root}">
	<header>
		<h2>Времена восхода и захода</h2>
	</header>
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
				phase="{state.phaseValue}"
				rotation="{state.angle}"
				size="{moonSize}"
			/>
		</foreignObject>
	</GaugeTime>
</section>

<section class="card {styles.phases}">
	<header>Лунный календарь</header>
	<div>
		{#each state.phases as { phase, timestamp } (`${phase}/${timestamp}`)}
			<Moon phase="{phase}" size={40} />
			<Datetime date="{new Date(timestamp)}" />
		{:else}
			<p>Введите дату для отображения данных</p>
		{/each}
	</div>
</section>
