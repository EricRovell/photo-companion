<script lang="ts">
	import { Timeline, TimelineSection, Event, EventEmpty } from "@lib/components";
	import { getTimeline } from "@services/events";
	import { incrementDateByDay, isValidDate } from "@lib/helpers";
	import { LAT, LON } from "@lib/constants";

	interface Timeline {
		date: Date;
		items: ReturnType<typeof getTimeline>;
	}

	export let date: Date;

	let timeline: Timeline[] = [];

	$: {
		const nextDate = incrementDateByDay(date, 1);

		timeline = [
			{
				date: date,
				items: getTimeline(date, LAT, LON, {
					predicate: event => event.timestamp > date.getTime()
				})
			},
			{
				date: nextDate,
				items: getTimeline(nextDate, LAT, LON, {
					predicate: event => event.timestamp > date.getTime()
				})
			}
		];
	}
</script>

{#if !isValidDate(date)}
	<p>Invalid date</p>
{:else}
	<Timeline>
		{#each timeline as { date, items } (date.getTime())}
			<TimelineSection {date}>
				{#each items as event (`${event.timestamp}/${event.name}`)}
					<Event {event} />
				{:else}
					<EventEmpty />
				{/each}
			</TimelineSection>
		{/each}
	</Timeline>
{/if}
