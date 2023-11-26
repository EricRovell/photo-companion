<script lang="ts">
	import { query } from "svelte-pathfinder";
	import Datetime from "../datetime/datetime.svelte";
	import Link from "../link/Link.svelte";
	import { lightsEventComponent } from "./event.lights";
	import { sunEventComponent } from "./event.sun";
	import { moonEventComponent } from "./event.moon";
	import { isLightsEvent, isMoonEvent } from "@services/events";
	import { createQueryDate } from "@lib/helpers";
	import type { TimelineEvent } from "@lib/types";
	import styles from "./event.module.css";

	// when need event reference for another page, usually secondary
	export let page: string | undefined = undefined;
	export let event: TimelineEvent;
	export let secondary = false;

	let current = false;
	let dateQuery = createQueryDate(new Date(event.timestamp));

	const eventComponent = (event: TimelineEvent) => {
		if (isLightsEvent(event)) {
			return lightsEventComponent(event);
		}

		if (isMoonEvent(event)) {
			return moonEventComponent(event);
		}

		return sunEventComponent(event);
	};

	let { component, props, message, title, type } = eventComponent(event);

	$: {
		if ($query.date) {
			current = ($query.date === dateQuery);
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
		<Link
			className="{styles.link}"
			href="/{page ?? type}?{new URLSearchParams({ ...$query, date: dateQuery }).toString()}"
		>
			<svelte:component
				this="{component}"
				{...props}
			/>
		</Link>
	</div>
	<article>
		<p>{title}</p>
		{#if message}
			<p>{message}</p>
		{/if}
	</article>
</li>
