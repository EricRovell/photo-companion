import { createSignal, Show } from "solid-js";

import { Button } from "../../../../button/button";
import { Text } from "../../../../text/text";
import { createNotification, createNotifications, Notifications } from "../../../index";
import { NOTIFICATIONS_STORY_CONFIG } from "../consts";

import type { NotificationVariant } from "../../../index";

export function ReactiveNotificationDemo() {
	const center = createNotifications();
	const [ visible, setVisible ] = createSignal(true);
	const [ mounted, setMounted ] = createSignal(true);
	const [ revision, setRevision ] = createSignal(1);
	const [ variant, setVariant ] = createSignal<NotificationVariant>("info");

	const NotificationSource = () => {
		createNotification(() => visible() ? {
			description: "The message and variant follow the controls above.",
			duration: Infinity,
			onDismiss: () => setVisible(false),
			title: `Notification revision ${revision()}`,
			variant: variant()
		} : null, { center });
		return null;
	};

	return (
		<div
			class="storybook-stack"
			style={NOTIFICATIONS_STORY_CONFIG.stageStyle}
		>
			<Text as="p" color="secondary" variant="text-s">
				Update the message or variant to change the same notification in place.
				Hide it or unmount its source to dismiss it automatically.
			</Text>
			<div
				class="storybook-row"
				style={{ "justify-content": "flex-start" }}
			>
				<Button onClick={() => setVisible(value => !value)}>
					{visible() ? "Hide notification" : "Show notification"}
				</Button>
				<Button
					appearance="outline"
					onClick={() => setRevision(value => value + 1)}
				>
					Update message
				</Button>
				<Button
					appearance="outline"
					onClick={() => setVariant(value => value === "info" ? "error" : "info")}
				>
					Change variant
				</Button>
				<Button
					appearance="ghost"
					onClick={() => setMounted(value => !value)}
				>
					{mounted() ? "Unmount source" : "Mount source"}
				</Button>
			</div>
			<Show when={mounted()}><NotificationSource /></Show>
			<Notifications center={center} contained />
		</div>
	);
}
