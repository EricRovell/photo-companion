<script lang="ts">
	import { Bulb, Event, GaugeTime, Timeline, Timer } from "@lib/components";
	import { provider } from "@services/lights";
	import { initTimelineProvider } from "@services/events";
	import { dict, template } from "@lib/dict";
	import { settingsStore as store } from "@lib/settings-store";
	import { secondsToHoursAndMinutes } from "@shared/utils";
	import { SUN_EVENT_NAMES } from "@lib/constants";
	import styles from "./lights.module.css";

	export let date: Date;

	const timelineProvider = initTimelineProvider({
		lightsEvents: [],
		sunEvents: SUN_EVENT_NAMES.filter(item => item !== "SUNRISE_START" && item !== "SUNSET_END"),
		secondaryEvents: new Set([ "SUNRISE_START", "SUNSET_END" ])
	});

	let schedule = provider?.getScheduleByDate(date);
	let state = provider?.getStateByDate();

	const handleAlarm = () => {
		state = provider?.getStateByDate();
	};

	$: schedule = provider?.getScheduleByDate(date);
	$: events = timelineProvider.getEvents(date, $store.latitude, $store.longitude);
</script>

{#if schedule && state}
	<div class="{styles.page}">
		<section data-label="lights-schedule" class="card">
			<header>
				<h2>{dict.TITLE.LIGHTS_DATA_BY_DATE}</h2>
			</header>
			<GaugeTime
				timeFrom="{new Date(schedule.LIGHTS_START)}"
				timeTo="{new Date(schedule.LIGHTS_END)}"
			>
				<Bulb x="-10" y="-10" width="20" height="20" glow />
			</GaugeTime>
			<footer>
				<p>{dict.LABEL.DURATION_LIGHTS}</p>
				<output>
					{template["hours-and-minutes"](secondsToHoursAndMinutes(schedule.duration))}
				</output>
			</footer>
		</section>
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
		<section
			data-active="{state.lights ? "" : undefined}"
			data-label="lights-event-timer"
			class="card"
		>
			<header>
				<h2>{dict.TITLE.LIGHTS_COUNTDOWN}</h2>
			</header>
			{#if !state}
				<p>{dict.MESSAGE.SOMETHING_WRONG}</p>
			{:else}
				<Bulb 
					glow="{state.lights}"
				/>
				<p class="{styles.note}">
					{@html template["lights-event"](state.lights)}
				</p>
				<Timer
					timestamp="{state.timestamp}"
					on:alarm={handleAlarm}
				/>
			{/if}
		</section>
	</div>
{/if}
