<script lang="ts">
	import { Datetime, TimelineGroup, Timeline, Event, EventEmpty } from "@lib/components";
	import { getTimeline } from "@services/events";
	import { incrementDateByDay } from "@lib/helpers";
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
					predicate: event => event.timestamp >= date.getTime()
				})
			},
			{
				date: nextDate,
				items: getTimeline(nextDate, LAT, LON, {
					predicate: event => event.timestamp >= date.getTime()
				})
			}
		];
	}
</script>

<TimelineGroup>
	{#each timeline as { date, items } (date.getTime())}
		<Timeline>
			<svelte:fragment slot="date">
				<Datetime
					{date}
					options={{
						year: "numeric",
						month: "long",
						day: "numeric" 
					}}
				/>
			</svelte:fragment>
			{#each items as event (`${event.timestamp}/${event.name}`)}
				<Event {event} />
			{:else}
				<EventEmpty />
			{/each}
		</Timeline>
	{/each}
</TimelineGroup>
