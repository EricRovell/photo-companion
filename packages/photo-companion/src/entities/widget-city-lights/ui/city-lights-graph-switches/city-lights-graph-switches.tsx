import { For } from "solid-js";

import { useTranslation } from "~/features/translation";

import { getCityLightsLabelEdge } from "../../lib";

import type { CityLightsNightEvent } from "../../types";

import styles from "./city-lights-graph-switches.module.css";

interface Props {
	events: CityLightsNightEvent[];
}

export function CityLightsGraphSwitches(props: Props) {
	const { format } = useTranslation();

	return (
		<For each={props.events} keyed={false}>
			{event => (
				<div
					class={styles.switch}
					data-estimated={event().uncertaintyMinutes > 0 ? "true" : undefined}
					data-switch={event().name}
					style={{ left: `${event().position}%` }}
					title={format().datetime(event().timestamp)}
				>
					<time
						class={styles["switch-time"]}
						data-edge={getCityLightsLabelEdge(event().position)}
						data-graph-event={event().name}
						datetime={new Date(event().timestamp).toISOString()}
						title={format().datetime(event().timestamp)}
					>
						{format().timeShort(event().timestamp)}
					</time>
				</div>
			)}
		</For>
	);
}
