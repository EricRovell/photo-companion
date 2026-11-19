import { createSignal, Show } from "solid-js";

import { Button } from "../../../../button/button";
import { Text } from "../../../../text/text";
import { createNotification, createNotifications, Notifications } from "../../../index";
import { NOTIFICATIONS_STORY_CONFIG } from "../consts";

export function StaticNotificationDemo() {
	const center = createNotifications();
	const [ mounted, setMounted ] = createSignal(true);

	const NotificationSource = () => {
		createNotification({
			description: "This notification belongs to the mounted component.",
			duration: Infinity,
			title: "Your photo walk is ready",
			variant: "success"
		}, { center });
		return null;
	};

	return (
		<div
			class="storybook-stack"
			style={NOTIFICATIONS_STORY_CONFIG.stageStyle}
		>
			<Text as="p" color="secondary" variant="text-s">
				Plain options show a notification while its source component is mounted.
				Unmount the source to dismiss it, then mount it again to show a new one.
			</Text>
			<Button onClick={() => setMounted(value => !value)}>
				{mounted() ? "Unmount source" : "Mount source"}
			</Button>
			<Show when={mounted()}><NotificationSource /></Show>
			<Notifications center={center} contained />
		</div>
	);
}
