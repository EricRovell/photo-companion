<script lang="ts">
	import { Bulb, Event, GaugeTime, Timeline, Timer } from "@lib/components";
	import { getLightsScheduleByDate, getLightsStateByDate } from "@services/lights";
	import { getTimeline } from "@services/events";
	import { LAT, LON } from "@lib/constants";
	import { dict, template } from "@lib/dict";
	import type { EventName } from "@lib/types";
	import styles from "./lights.module.css";

	export let date: Date;

	const timelineEvents: Set<EventName> = new Set([
		"lights:start",
		"lights:end",
		"sunrise:start",
		"sunset:end"
	]);

	const timelineEventsSecondary: Set<EventName> = new Set([
		"sunrise:start",
		"sunset:end"
	]);

	let schedule = getLightsScheduleByDate(date);
	let state = getLightsStateByDate();

	const handleAlarm = () => {
		state = getLightsStateByDate();
	};

	$: schedule = getLightsScheduleByDate(date);
</script>

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
				{template["hours-and-minutes"](schedule.duration)}
			</output>
		</footer>
	</section>
	<section data-label="timeline">
		<Timeline>
			{#each getTimeline(date, LAT, LON, { predicate: event => timelineEvents.has(event.name) }) as event (`${event.timestamp}/${event.name}`)}
				{@const secondary = timelineEventsSecondary.has(event.name)}
				<Event
					page="{secondary ? "lights" : undefined}"
					{event}
					{secondary}
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
