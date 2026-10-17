import { createUniqueId, Show } from "solid-js";

import { Button } from "~/shared/ui";

import type { DeviceHeadingError } from "../../../../shared/types/device-heading";
import type { AzimuthWidgetLabels } from "../../types";

import styles from "./device-alignment.module.css";

interface Props {
	error: DeviceHeadingError | null;
	labels: Pick<AzimuthWidgetLabels, "align" | "alignDenied" | "alignTimeout" | "alignUnavailable">;
	onRequest: () => Promise<void>;
	pending: boolean;
}

export function DeviceAlignment(props: Props) {
	const errorId = createUniqueId();
	const getErrorMessage = () => {
		switch (props.error) {
			case "denied": return props.labels.alignDenied;
			case "timeout": return props.labels.alignTimeout;
			case "unavailable": return props.labels.alignUnavailable;
			default: return null;
		}
	};

	return (
		<div class={styles.controls}>
			<Button
				appearance="outline"
				aria-busy={props.pending}
				aria-describedby={getErrorMessage() ? errorId : undefined}
				disabled={props.pending}
				onClick={() => void props.onRequest()}
				pending={props.pending}
			>
				{props.labels.align}
			</Button>
			<Show when={getErrorMessage()}>
				{message => (
					<p class={styles.error} id={errorId} role="alert">
						{message()}
					</p>
				)}
			</Show>
		</div>
	);
}
