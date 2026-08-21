import { createMemo, Show } from "solid-js";
import { isNullable } from "utils/validators";

import { EclipseGraphFrame } from "~/entities/eclipse";
import { useTranslation } from "~/features/translation";

import { GRAPH_CONFIG } from "../../config";
import {
	getEclipseGraphPoint,
	getSolarEclipseTrack,
	isEclipseGraphPointOutside
} from "../../lib";

import type { SolarEclipseGraphProps } from "../../model";

import styles from "./solar-eclipse-graph.module.css";

export function SolarEclipseGraph(props: SolarEclipseGraphProps) {
	const { t } = useTranslation();
	const moonPoint = createMemo(() => getEclipseGraphPoint(props.state));
	const moonOutside = createMemo(() => isEclipseGraphPointOutside(
		moonPoint(),
		props.state.moon.angularRadius
	));

	const track = createMemo(() => isNullable(props.event)
		? null
		: getSolarEclipseTrack(props.event, props.latitude, props.longitude));

	return (
		<EclipseGraphFrame
			altitudeTicks={GRAPH_CONFIG.altitudeTicks}
			azimuthTicks={GRAPH_CONFIG.azimuthTicks}
			centerAltitude={props.state.sun.altitude}
			class={styles.graph}
			description={`${t().SOLAR_ECLIPSE.GRAPH_DESCRIPTION}${moonOutside() ? ` ${t().SOLAR_ECLIPSE.MOON_OUTSIDE_VIEW}` : ""}`}
			horizonLabel={t().SOLAR_ECLIPSE.HORIZON}
			title={t().SOLAR_ECLIPSE.GRAPH_TITLE}
			viewAltitudeRadius={GRAPH_CONFIG.viewAltitudeRadius}
			viewAzimuthRadius={GRAPH_CONFIG.viewAzimuthRadius}
		>
			<Show keyed when={track()}>
				{path => <path aria-hidden="true" class={styles.track} d={path} data-eclipse-track />}
			</Show>

			<circle
				aria-hidden="true"
				class={styles.sun}
				cx="0"
				cy="0"
				r={props.state.sun.angularRadius}
			/>
			<circle
				aria-hidden="true"
				class={styles.moon}
				cx={moonPoint().x}
				cy={moonPoint().y}
				data-eclipse-moon={moonOutside() ? undefined : ""}
				data-visible={moonOutside() ? undefined : ""}
				r={props.state.moon.angularRadius}
			/>
		</EclipseGraphFrame>
	);
}
