<script lang="ts">
	import { getSunPosition } from "moon-sun-calc";

	import { CardInfo, Event, GaugeTime, Sun, Timeline, ElevationGraph } from "@lib/components";
	import { getSunData } from "@services/sun";
	import { t } from "@stores/lang";
	import { initTimelineProvider } from "@services/events";
	import { settingsStore as store } from "@lib/stores";
	import { getAngleFromTime } from "@lib/helpers";
	import styles from "./sun.module.css";

	export let date: Date;

	const timelineProvider = initTimelineProvider({
		sunEvents: []
	});

	$: state = getSunData(date, $store.latitude, $store.longitude);
	$: events = timelineProvider.getEvents(date, $store.latitude, $store.longitude);

	const sunSize = 30;
</script>

<div class="{styles.page}">
	<section data-label="sun" class="card">
		<header>
			<h2>{$t.TITLE.SUN_TIMES}</h2>
		</header>
		<GaugeTime
			timeFrom="{state.sunrise}"
			timeTo="{state.sunset}"
			pointerAngle="{getAngleFromTime(date)}"
		>
			<Sun
				x="-{sunSize / 2}"
				y="-{sunSize / 2}"
				width="{sunSize}"
				height="{sunSize}"
			/>
		</GaugeTime>
		<footer class="{styles["gauge-footer"]}">
			<ol>
				<li>
					<span>{state.goldenHourDawn}</span>
					<span>{$t.SUN_TIMES.GOLDEN_HOUR}</span>
					<span>{state.goldenHourDusk}</span>
				</li>
				<li>
					<span>{state.blueHourDawn}</span>
					<span>{$t.SUN_TIMES.BLUE_HOUR}</span>
					<span>{state.blueHourDusk}</span>
				</li>
				<li>
					<span>... — {state.nightEnd}</span>
					<span>{$t.SUN_TIMES.NIGHT}</span>
					<span>{state.nightStart} — ...</span>
				</li>
			</ol>
		</footer>
	</section>
	<section data-label="altitude" class="card">
		<header>
			<h2>{$t.TITLE.ELEVATION_SUN}</h2>
		</header>
		<ElevationGraph
			{date}
			entries="{[
				{
					getAltitude: getSunPosition,
					id: "sun"
				}
			]}"
		/>
	</section>
	<CardInfo data="{{
		[$t.LABEL.DURATION_DAYLIGHT]: state.dayDuration,
		[$t.LABEL.ALTITUDE]: state.position.altitude,
		[$t.LABEL.AZIMUTH]: state.position.azimuth,
		[$t.LABEL.DECLINATION]: state.position.declination,
		[$t.LABEL.ZENITH]: state.position.zenith
	}}" />
	<section data-label="timeline">
		<Timeline>
			{#each events as event (`${event.timestamp}/${event.name}`)}
				<Event {event} />
			{/each}
		</Timeline>
	</section>
</div>
