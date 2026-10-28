import type { ParentProps } from "solid-js";

import { Card } from "~/shared/ui";

import { ALTITUDE_WIDGET_CONFIG as CONFIG } from "../../config";
import { AltitudeContext, createAltitudeContext } from "../../model/altitude-context";

import type { AltitudeWidgetProps } from "../../types";

import styles from "./altitude-widget.module.css";

export function Root(props: ParentProps<AltitudeWidgetProps>) {
	const context = createAltitudeContext(props);

	return (
		<AltitudeContext.Provider value={context}>
			<Card
				aria-labelledby={`${context.id}-title`}
				class={styles.root}
				data-label="altitude"
				style={{
					"--altitude-inactive-opacity": CONFIG.selection.inactiveOpacity,
					"--altitude-max-width": CONFIG.layout.maxWidth,
					"--altitude-moon-color": CONFIG.colors.moon,
					"--altitude-sun-color": CONFIG.colors.sun
				}}
			>
				{props.children}
			</Card>
		</AltitudeContext.Provider>
	);
}
