<script lang="ts">
	import { Bulb, Event, GaugeTime, Timeline, Timer } from "@lib/components";
	import { provider } from "@services/lights";
	import { initTimelineProvider } from "@services/events";
	import { dict, template } from "@lib/dict";
	import { settingsStore as store } from "@lib/settings-store";
	import { secondsToHoursAndMinutes } from "@shared/utils";
	import styles from "./lights.module.css";
	import { SUN_EVENT_NAMES } from "@lib/constants";

	export let date: Date;

	const timelineProvider = initTimelineProvider({
		lightsEvents: [],
		sunEvents: SUN_EVENT_NAMES.filter(item => item !== "sunrise:start" && item !== "sunset:end"),
		secondaryEvents: new Set([ "sunrise:start", "sunset:end" ])
	});

	let schedule = provider?.getScheduleByDate(date);
	let state = provider?.getStateByDate();
	let events = timelineProvider.getEvents(date, $store.latitude, $store.longitude);

	const handleAlarm = () => {
		state = provider?.getStateByDate();
	};

	$: schedule = provider?.getScheduleByDate(date);
</script>

{#if schedule && state}
	<div class="{styles.page}">
		<section data-label="lights-schedule" class="card">
			<header>
				<h2>{dict["header-lights-by-date"]}</h2>
			</header>
			<GaugeTime
				timeFrom="{new Date(schedule["lights:start"])}"
				timeTo="{new Date(schedule["lights:end"])}"
			>
				<Bulb x="-10" y="-10" width="20" height="20" glow />
			</GaugeTime>
			<footer>
				<p>{dict["duration-lights"]}</p>
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
				<h2>{dict["header-lights-timer"]}</h2>
			</header>
			{#if !state}
				<p>{dict["something-wrong"]}</p>
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
