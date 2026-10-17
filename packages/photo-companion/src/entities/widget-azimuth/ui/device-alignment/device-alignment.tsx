import { createEffect, createUniqueId, on } from "solid-js";
import { toast } from "solid-sonner";

import { Button } from "~/shared/ui";

import type { DeviceHeadingError } from "../../../../shared/types/device-heading";
import type { AzimuthWidgetLabels } from "../../types";

import styles from "./device-alignment.module.css";

interface Props {
	active: boolean;
	error: DeviceHeadingError | null;
	labels: Pick<AzimuthWidgetLabels, "align" | "alignBlocked" | "alignDenied" | "alignTimeout" | "alignUnavailable">;
	onToggle: () => Promise<void> | void;
	pending: boolean;
}

export function DeviceAlignment(props: Props) {
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
				aria-pressed={props.active}
				class={styles.button}
				disabled={props.pending}
				onClick={() => void props.onToggle()}
				pending={props.pending}
			>
				{props.labels.align}
			</Button>
		</div>
	);
}
