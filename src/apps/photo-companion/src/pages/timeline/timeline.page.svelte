<script lang="ts" context="module">
	import type { TimelineEvent } from "@shared/types";

	interface TimelineEntry {
		date: Date;
		items: TimelineEvent[];
	}
</script>

<script lang="ts">
	import { Datetime, TimelineGroup, Timeline, Event, EventEmpty } from "@lib/components";
	import { initTimelineProvider } from "@services/events";
	import { incrementDateByDay } from "@shared/utils";
	import { settingsStore as store } from "@lib/stores";
	import { Link, Icon } from "@lib/components";
	import { iconWarning } from "@lib/icons";
	import styles from "./timeline.module.css";

	export let date: Date;

	const hasNoEvents = () => {
		return [
			$store.events_bridges_spb,
			$store.events_lights,
			$store.events_moon,
			$store.events_sun
		].every(check => !check);
	};

	const timelineProvider = initTimelineProvider({
		bridgeEvents: $store.events_bridges_spb,
		lightsEvents: $store.events_lights,
		moonEvents: $store.events_moon,
		sunEvents: $store.events_sun,
		predicate: event => event.timestamp >= date.getTime()
	});

	let timeline: TimelineEntry[] = [];

	$: {
		const tomorrow = incrementDateByDay(date, 1);

		timeline = [
			{
				date: date,
				items: timelineProvider.getEvents(date, $store.latitude, $store.longitude)
			},
			{
				date: tomorrow,
				items: timelineProvider.getEvents(tomorrow, $store.latitude, $store.longitude)
			}
		];
	}
</script>

<div class="{styles.page}">
	{#if hasNoEvents()}
		<article class="{styles.warning}">
			<h2>Все типы событий отключены</h2>
			<Icon path="{iconWarning}" />
			<p>
				Изменить настройки можно <Link href="/settings#event-blacklist">тут</Link>
			</p>
		</article>
	{:else}
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
	{/if}
</div>
