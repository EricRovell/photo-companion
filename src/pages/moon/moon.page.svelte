<script lang="ts">
	import { GaugeTime, Moon, Datetime } from "@lib/components";
	import { getMoonData, getMoonPhases } from "@services/moon";
	import { LAT, LON } from "@lib/constants";
	import styles from "./moon.module.css";

	export let date = new Date().getTime();

	const defaultState = {
		moonrise: new Date("null"),
		moonset: new Date("null"),
		phaseValue: 0,
		angle: 0,
		fraction: 0,
		waxing: false
	};

	const moonSize = 48;
	let state = getMoonData(new Date(date), LAT, LON);

	$: phases = getMoonPhases(new Date(date));

	$: {
		if (date) {
			state = getMoonData(new Date(date), LAT, LON);
		} else {
			state = defaultState;
		}
	}
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
		{#each phases as { phase, timestamp } (`${phase}/${timestamp}`)}
			<Moon phase="{phase}" size={40} />
			<Datetime date="{new Date(timestamp)}" />
		{:else}
			<p>Введите дату для отображения данных</p>
		{/each}
	</div>
</section>
