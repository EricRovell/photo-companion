import { For } from "solid-js";

import { ALTITUDE_WIDGET_CONFIG as CONFIG } from "../../config";
import { useAltitudeContext } from "../../model/altitude-context";

import styles from "./altitude-cursor.module.css";

export function Cursor() {
	const { cursorX, getMarkerAltitude, isSelected, series, y } = useAltitudeContext();

	return (
		<g>
			<line
				class={styles.cursor}
				x1={cursorX()}
				x2={cursorX()}
				y1={CONFIG.plot.top}
				y2={CONFIG.plot.bottom}
			/>
			<For each={series().filter(entity => isSelected(entity.id))}>
				{entity => {
					const altitude = () => getMarkerAltitude(entity.id);
					const markerY = () => y(altitude());

					return (
						<g
							class={styles.entity}
							data-entity={entity.id}
						>
							<circle
								class={styles["marker-halo"]}
								cx={cursorX()}
								cy={markerY()}
								r={CONFIG.marker.haloRadius}
							/>
							<circle
								class={styles.marker}
								cx={cursorX()}
								cy={markerY()}
								data-above={altitude() >= 0}
								r={CONFIG.marker.radius}
							/>
						</g>
					);
				}}
			</For>
		</g>
	);
}
