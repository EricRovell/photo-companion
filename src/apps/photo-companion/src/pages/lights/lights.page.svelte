<script lang="ts">
	import { onMount } from "svelte";
	
	import { formatTimeDuration } from "@stores/lang";
	import { CardInfo, Bulb, Event, GaugeTime, Timeline } from "@lib/components";
	import { provider } from "@services/lights";
	import { initTimelineProvider } from "@services/events";
	import { t } from "@stores/lang";
	import { settingsStore as store } from "@lib/stores";
	import { SUN_EVENT_NAMES } from "@lib/constants";
	import { getAngleFromTime } from "@lib/helpers";
	import { createTimer } from "@lib/components/timer";
	import styles from "./lights.module.css";

	export let date: Date;

	const timelineProvider = initTimelineProvider({
		lightsEvents: [],
		sunEvents: SUN_EVENT_NAMES.filter(item => item !== "SUNRISE_START" && item !== "SUNSET_END"),
		secondaryEvents: new Set([ "SUNRISE_START", "SUNSET_END" ])
	});

	let schedule = provider.getScheduleByDate(date);
	let state = provider.getStateByDate();
	let timer = createTimer(state?.timestamp ?? 0, {
		callback: handleAlarm
	});

	function handleAlarm() {
		state = provider.getStateByDate();
		timer.set(state.timestamp);
	}

	$: timerMessage = state?.lights
		? $t.LABEL.TILL_TURNED_OFF
		: $t.LABEL.TILL_TURNED_ON;

	$: schedule = provider?.getScheduleByDate(date);
	$: events = timelineProvider.getEvents(date, $store.latitude, $store.longitude);

	onMount(() => {
		timer.start();

		return () => timer.stop();
	});
</script>

{#if schedule && state}
	<div class="{styles.page}">
		<section data-label="lights-schedule" class="card">
			<header>
				<h2>{$t.TITLE.LIGHTS_DATA_BY_DATE}</h2>
			</header>
			<GaugeTime
				timeFrom="{new Date(schedule.LIGHTS_START)}"
				timeTo="{new Date(schedule.LIGHTS_END)}"
				pointerAngle="{getAngleFromTime(date)}"
			>
				<Bulb x="-10" y="-10" width="20" height="20" glow />
			</GaugeTime>
		</section>
		<CardInfo
			data="{{
				[$t.LABEL.CITY]: $t.CITIES[provider?.city ?? "SAINT_PETERSBURG"],
				[$t.LABEL.LIGHTS_CITY]: state.lights ? $t.LABEL.TURNED_ON : $t.LABEL.TURNED_OFF,
				[$t.LABEL.DURATION_LIGHTS]: formatTimeDuration(schedule.duration),
				[timerMessage]: formatTimeDuration($timer)
			}}"
		/>
		<section data-label="timeline">
			<Timeline>
				{#each events as event (`${event.timestamp}/${event.name}`)}
					<Event
						page="{event.secondary ? "lights" : undefined}"
						{event}
						secondary={event.secondary}
					/>
				{/each}
			</Timeline>
		</section>
	</div>
{/if}
