<script lang="ts">
	import { query } from "svelte-pathfinder";
	import Datetime from "../datetime/datetime.svelte";
	import { lightsEventComponent } from "./event.lights";
	import { sunEventComponent } from "./event.sun";
	import { moonEventComponent } from "./event.moon";
	import { isLightsEvent, isMoonEvent } from "@services/events";
	import { createQueryDate } from "@lib/layout/with-date/with-date.helpers";
	import type { TimelineEvent } from "@lib/types";
	import styles from "./event.module.css";

	export let event: TimelineEvent;
	export let secondary = false;

	let current = false;

	const eventComponent = (event: TimelineEvent) => {
		if (isLightsEvent(event)) {
			return lightsEventComponent(event);
		}

		if (isMoonEvent(event)) {
			return moonEventComponent(event);
		}

		return sunEventComponent(event);
	};

	let { component, props, message, title } = eventComponent(event);

	$: {
		if ($query.date) {
			const eventDate = createQueryDate(new Date(event.timestamp));

			current = ($query.date === eventDate);
		} else {
			current = false;
		}
	}
</script>

<li
	class="{styles.event}"
	aria-current="{current ? "date" : undefined}"
	data-secondary="{secondary ? "" : undefined}"
	data-event-name="{event.name}"
>
	<Datetime
		date="{new Date(event.timestamp)}"
		options={{
			hour12: false,
			hour: "2-digit",
			minute: "2-digit"
		}}
	/>
	<div class="{styles.icon}" data-event-icon>
		<svelte:component
			this="{component}"
			{...props}
		/>
	</div>
	<article>
		<p>{title}</p>
		{#if message}
			<p>{message}</p>
		{/if}
	</article>
</li>
