<script lang="ts">
	import { GaugeTime, Moon, Datetime, Timeline, Event } from "@lib/components";
	import { getMoonData } from "@services/moon";
	import { getTimeline } from "@services/events";
	import { dict } from "@lib/dict";
	import { LAT, LON } from "@lib/constants";
	import styles from "./moon.module.css";
	import { round } from "@lib/helpers";

	export let date: Date;

	const moonSize = 48;
	const timelineEvents = new Set([ "sunrise:start", "sunset:end", "moonrise", "moonset" ]);
	const timelineEventsSecondary = new Set([ "sunrise:start", "sunset:end" ]);

	let state = getMoonData(date, LAT, LON);

	$: state = getMoonData(date, LAT, LON);
</script>

<div class="{styles.page}">
	<section data-label="moon" class="card {styles.root}">
		<header>
			<h2>{dict["header-moon-moontimes"]}</h2>
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
					rotation="{state.zenithAngle}"
					size="{moonSize}"
				/>
			</foreignObject>
		</GaugeTime>
		<footer>
			<p>{dict[state.name]}</p>
			<p>{round(state.fraction * 100, 2)}%</p>
		</footer>
	</section>
	<section data-label="timeline">
		<Timeline>
			{#each getTimeline(date, LAT, LON, { predicate: event => timelineEvents.has(event.name) }) as event (`${event.timestamp}/${event.name}`)}
				<Event
					{event}
					secondary="{timelineEventsSecondary.has(event.name)}"
				/>
			{/each}
		</Timeline>
	</section>
	<section data-label="phases-calendar" class="card {styles.phases}">
		<header>{dict["header-moon-phase-calendar"]}</header>
		<div>
			{#each state.phases as { phase, timestamp } (`${phase}/${timestamp}`)}
				<Moon phase="{phase}" size={40} />
				<Datetime date="{new Date(timestamp)}" />
			{:else}
				<p>Введите дату для отображения данных</p>
			{/each}
		</div>
	</section>
</div>
