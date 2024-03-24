<script lang="ts">
	import { query } from "svelte-pathfinder";
	import { Datetime, Link } from "ui";

	import { formatDatetime } from "@stores/locale";
	import { lightsEventComponent } from "./event.lights";
	import { bridgeEventComponent } from "./event.bridge";
	import { sunEventComponent } from "./event.sun";
	import { moonEventComponent } from "./event.moon";
	import { isBridgeEvent, isLightsEvent, isMoonEvent, isSunEvent } from "@lib/helpers/validators";
	import { createQueryDate } from "@lib/helpers";
	import type { TimelineEvent } from "types";
	import styles from "./event.module.css";

	// when need event reference for another page, usually secondary
	export let page: Undefinable<string> = undefined;
	export let event: TimelineEvent;
	export let secondary = false;

	let current = false;
	let dateQuery = createQueryDate(new Date(event.timestamp));

	const eventComponent = (event: TimelineEvent) => {
		if (isBridgeEvent(event)) {
			return bridgeEventComponent(event);
		}

		if (isLightsEvent(event)) {
			return lightsEventComponent(event);
		}

		if (isMoonEvent(event)) {
			return moonEventComponent(event);
		}

		if (isSunEvent(event)) {
			return sunEventComponent(event);
		}

		throw new Error(`Unknown event is provided: ${JSON.stringify(event)}`);
	};

	let { component, props, message, title, type } = eventComponent(event);
	let linkTitle = `${title}: ${formatDatetime(new Date(event.timestamp))}`;

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
			href="/{page ?? type ?? ""}?{new URLSearchParams({ ...$query, date: dateQuery }).toString()}"
			title="{linkTitle}"
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
