<script lang="ts">
	import { Timeline, TimelineSection, Event, EventEmpty } from "@lib/components";
	import { getTimeline } from "@services/events";
	import { incrementDateByDay } from "@lib/helpers";
	import { LAT, LON } from "@lib/constants";
	import { afterUpdate } from "svelte";

	interface Timeline {
		date: Date;
		items: ReturnType<typeof getTimeline>;
	}

	export let date: string = "";

	let timeline: Timeline[] = [];

	afterUpdate(() => {
		const thisDate = new Date(date);
		const nextDate = incrementDateByDay(thisDate, 1);

		timeline = [
			{
				date: thisDate,
				items: getTimeline(thisDate, LAT, LON, {
					predicate: event => event.timestamp > thisDate.getTime()
				})
			},
			{
				date: nextDate,
				items: getTimeline(nextDate, LAT, LON, {
					predicate: event => event.timestamp > thisDate.getTime()
				})
			}
		];
	});
</script>

<Timeline>
	{#each timeline as { date, items }}
		<TimelineSection {date}>
			{#each items as event (`${event.timestamp}/${event.name}`)}
				<Event {event} />
			{:else}
				<EventEmpty />
			{/each}
		</TimelineSection>
	{:else}
		<p>Invalid date</p>
	{/each}
</Timeline>
