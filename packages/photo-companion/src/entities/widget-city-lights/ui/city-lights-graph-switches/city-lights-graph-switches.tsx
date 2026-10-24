import { For } from "solid-js";

import { useTranslation } from "~/features/translation";

import type { CityLightsGraphLabel } from "../../types";

import styles from "./city-lights-graph-switches.module.css";

interface Props {
	labels: CityLightsGraphLabel[];
}

export function CityLightsGraphSwitches(props: Props) {
	const { format } = useTranslation();

	return (
		<For each={props.labels}>
			{event => (
				<div
					class={styles.switch}
					data-estimated={event.uncertaintyMinutes > 0 || undefined}
					style={{ left: `${event.position}%` }}
				>
					<time
						class={styles["switch-time"]}
						data-edge={event.edge}
						data-graph-event={event.name}
						data-row={event.row}
						dateTime={new Date(event.timestamp).toISOString()}
						title={format().datetime(event.timestamp)}
					>
						{format().timeShort(event.timestamp)}
					</time>
				</div>
			)}
		</For>
	);
}
