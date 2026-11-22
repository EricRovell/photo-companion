import { onSettled } from "solid-js";

import { mountNotifications } from "../lib";

import type { NotificationCenter, NotificationViewportOptions } from "../types";

export interface NotificationsProps extends NotificationViewportOptions {
	center: NotificationCenter;
}

export function Notifications(props: NotificationsProps) {
	let host: HTMLDivElement | undefined;

	onSettled(() => {
		if (host) {
			return mountNotifications({
				center: props.center,
				host,
				viewportOptions: props
			});
		}
	});


	return (
		<div ref={element => { host = element; }} />
	);
}
