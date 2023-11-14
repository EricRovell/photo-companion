<script lang="ts">
	import { Timeline, TimelineSection, Event, EventEmpty } from "@lib/components";
	import { getTimeline } from "@services/events";
	import { incrementDateByDay } from "@lib/helpers";
	import { LAT, LON } from "@lib/constants";

	interface Timeline {
		date: Date;
		items: ReturnType<typeof getTimeline>;
	}

	const timeline: Timeline[] = [];

	const now = new Date().getTime();

	for (let i = 0; i < 3; i++) {
		const date = i > 0
			? incrementDateByDay(new Date(), i)
			: new Date();

		timeline.push({
			date: date,
			items: getTimeline(date, LAT, LON, {
				predicate: event => event.timestamp > now
			})
		});
	}
</script>

<Timeline>
	{#each timeline as { date, items }}
		<TimelineSection {date}>
			{#each items as event}
				<Event {event} />
			{:else}
				<EventEmpty />
			{/each}
		</TimelineSection>
	{/each}
</Timeline>
