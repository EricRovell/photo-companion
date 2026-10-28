import { For, Show } from "solid-js";

import { ALTITUDE_WIDGET_CONFIG } from "../../config";
import { useAltitudeContext } from "../../model/altitude-context";

import styles from "./altitude-path.module.css";

const PLOT = ALTITUDE_WIDGET_CONFIG.plot;

export function Path() {
	const { getPath, horizon, id, isSelected, series } = useAltitudeContext();

	return (
		<For each={series()}>
			{entity => {
				const gradientId = `${id}-${entity.id}-fill`;

				return (
					<Show when={isSelected(entity.id)}>
						<g
							class={styles.entity}
							data-entity={entity.id}
						>
							<defs>
								<linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
									<stop offset="0%" stop-color="currentColor" stop-opacity="0.2" />
									<stop
										offset="100%"
										stop-color="currentColor"
										stop-opacity="0.01"
									/>
								</linearGradient>
							</defs>
							<g clip-path={`url(#${id}-above)`}>
								<path
									d={`${getPath(entity.id)} L${PLOT.right},${horizon()} L${PLOT.left},${horizon()} Z`}
									fill={`url(#${gradientId})`}
								/>
								<path class={styles["path-above"]} d={getPath(entity.id)} />
							</g>
							<path
								class={styles["path-below"]}
								clip-path={`url(#${id}-below)`}
								d={getPath(entity.id)}
							/>
						</g>
					</Show>
				);
			}}
		</For>
	);
}
