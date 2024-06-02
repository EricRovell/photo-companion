<script lang="ts" context="module">
	import type { TimelineEvent } from "types";

	interface TimelineEntry {
		date: Date;
		items: TimelineEvent[];
	}
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import { prefs } from "svelte-pathfinder";
	import { Datetime, Link, Icon } from "ui";
	import { iconWarning } from "ui/icons";
	import { incrementDateByDay } from "utils/date";

	import { TimelineGroup, Timeline, Event, EventEmpty } from "@lib/components";
	import { initTimelineProvider } from "@services/events";
	import { settingsStore as store } from "@lib/stores";
	import styles from "./timeline.module.css";
	import { formatDate } from "@lib/stores/lang/formatters";

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

	onMount(() => {
		prefs.scroll = true;

		return () => {
			prefs.scroll = false;
		};
	});
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
						<Datetime value="{formatDate(date)}" />
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
