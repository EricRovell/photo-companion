<script lang="ts">
	import { Timeline, TimelineSection, TimelineEntry } from "@lib/components";
	import { getTimeline } from "@services/timeline";
	import { incrementDateByDay } from "@lib/helpers";
	import Icon from "./timeline.icon.svelte";
	import { dict } from "@lib/dict";

	interface Timeline {
		date: Date;
		items: ReturnType<typeof getTimeline>;
	}

	const timeline: Timeline[] = [];

	for (let i = 0; i < 3; i++) {
		const date = i > 0
			? incrementDateByDay(new Date(), i)
			: new Date();

		timeline.push({
			date: date,
			items: getTimeline(date)
		});
	}
</script>

<Timeline>
	{#each timeline as { date, items }}
		<TimelineSection {date}>
			{#each items as { name, timestamp }}
				<TimelineEntry date={new Date(timestamp)}>
					<Icon eventName="{name}" />
					<p slot="label">
						{dict[name]}
					</p>
				</TimelineEntry>
			{:else}
				<TimelineEntry>
					<svg viewBox="0 0 256 256" fill="currentcolor">
						<rect width="256" height="256" fill="none"/>
						<circle cx="128" cy="128" r="12"/>
						<circle cx="196" cy="128" r="12"/>
						<circle cx="60" cy="128" r="12"/>
					</svg>
					<p slot="label">
						Никаких событий на сегодня
					</p>
				</TimelineEntry>
			{/each}
		</TimelineSection>
	{/each}
</Timeline>
