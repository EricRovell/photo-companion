<script lang="ts">
	import Datetime from "../datetime/datetime.svelte";
	import { lightsEventComponent } from "./event.lights";
	import { sunEventComponent } from "./event.sun";
	import { moonEventComponent } from "./event.moon";
	import { isLightsEvent, isMoonEvent } from "@services/events";
	import type { TimelineEvent } from "@lib/types";
	import styles from "./event.module.css";

	export let event: TimelineEvent;
	export let secondary = false;

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
</script>

<li
	class="{styles.event}"
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
