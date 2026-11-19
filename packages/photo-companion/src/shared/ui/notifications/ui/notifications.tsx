import { onCleanup, onMount } from "solid-js";

import { mountNotifications } from "../lib";

import type { NotificationCenter, NotificationViewportOptions } from "../types";

export interface NotificationsProps extends NotificationViewportOptions {
	center: NotificationCenter;
}

export function Notifications(props: NotificationsProps) {
	let host: HTMLDivElement | undefined;
	let dispose: (() => void) | undefined;

	onMount(() => {
		if (host) {
			dispose = mountNotifications({
				center: props.center,
				host,
				viewportOptions: props
			});
		}
	});

	onCleanup(() => dispose?.());

	return (
		<div ref={element => { host = element; }} />
	);
}
