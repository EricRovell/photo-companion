import { createEffect, createUniqueId, on, Show } from "solid-js";
import { toast } from "solid-sonner";

import { Button, Icon } from "~/shared/ui";

import type { DeviceHeadingError } from "../../../../shared/types/device-heading";
import type { AzimuthWidgetLabels } from "../../types";

import styles from "./device-heading-toggle.module.css";

interface Props {
	active: boolean;
	error: DeviceHeadingError | null;
	labels: Pick<AzimuthWidgetLabels, "align" | "alignBlocked" | "alignDenied" | "aligned" | "alignTimeout" | "alignUnavailable">;
	onToggle: () => Promise<void> | void;
	pending: boolean;
}

export function DeviceHeadingToggle(props: Props) {
	const notificationId = createUniqueId();

	const getErrorMessage = (error: DeviceHeadingError | null) => {
		switch (error) {
			case "blocked": return props.labels.alignBlocked;
			case "denied": return props.labels.alignDenied;
			case "timeout": return props.labels.alignTimeout;
			case "unavailable": return props.labels.alignUnavailable;
			default: return null;
		}
	};

	createEffect(on(() => props.error, error => {
		const message = getErrorMessage(error);

		if (message) {
			toast.error(message, { id: notificationId });
		} else {
			toast.dismiss(notificationId);
		}
	}));

	return (
		<div class={styles.controls}>
			<Button
				appearance="outline"
				aria-busy={props.pending}
				aria-label={props.labels.align}
				aria-pressed={props.active}
				class={styles.button}
				disabled={props.pending}
				onClick={() => void props.onToggle()}
				pending={props.pending}
			>
				<Icon aria-hidden="true" class={styles.icon} viewBox="0 0 24 24">
					<circle cx="12" cy="12" fill="none" r="9" stroke="currentColor" stroke-width="1.5" />
					<Show when={props.active} fallback={<path d="m16.5 7.5-3 6-6 3 3-6 6-3Zm-5 4-1 2 2-1 1-2-2 1Z" />}>
						<path d="m8 12 2.5 2.5L16 9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" />
					</Show>
				</Icon>
				{props.active ? props.labels.aligned : props.labels.align}
			</Button>
		</div>
	);
}
