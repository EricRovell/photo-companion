import { createMemo, createUniqueId, For, Show } from "solid-js";
import { isNullable } from "utils/validators";

import { useTranslation } from "~/features/translation";

import {
	GRAPH_TICKS,
	GRAPH_VIEW_BOX,
	VIEW_ALTITUDE_RADIUS,
	VIEW_AZIMUTH_RADIUS
} from "../../config";
import {
	getEclipseGraphPoint,
	getSolarEclipseTrack,
	isEclipseGraphPointOutside
} from "../../lib";

import type { SolarEclipseGraphProps } from "../../model";

import styles from "./solar-eclipse-graph.module.css";

export function SolarEclipseGraph(props: SolarEclipseGraphProps) {
	const { t } = useTranslation();
	const titleId = createUniqueId();
	const descriptionId = createUniqueId();

	const moonPoint = createMemo(() => getEclipseGraphPoint(props.state));
	const moonOutside = createMemo(() => isEclipseGraphPointOutside(
		moonPoint(),
		props.state.moon.angularRadius
	));

	const horizonY = createMemo(() => props.state.sun.altitude);
	const horizonVisible = createMemo(() => Math.abs(horizonY()) <= VIEW_ALTITUDE_RADIUS);

	const track = createMemo(() => isNullable(props.event)
		? null
		: getSolarEclipseTrack(props.event, props.latitude, props.longitude));

	return (
		<svg
			aria-labelledby={`${titleId} ${descriptionId}`}
			class={styles.graph}
			role="img"
			viewBox={GRAPH_VIEW_BOX}
		>
			<title id={titleId}>{t().SOLAR_ECLIPSE.GRAPH_TITLE}</title>
			<desc id={descriptionId}>
				{t().SOLAR_ECLIPSE.GRAPH_DESCRIPTION}
				{moonOutside() ? ` ${t().SOLAR_ECLIPSE.MOON_OUTSIDE_VIEW}` : ""}
			</desc>

			<rect
				class={styles.background}
				height={2 * VIEW_ALTITUDE_RADIUS}
				width={2 * VIEW_AZIMUTH_RADIUS}
				x={-VIEW_AZIMUTH_RADIUS}
				y={-VIEW_ALTITUDE_RADIUS}
			/>
			<g aria-hidden="true" class={styles.grid}>
				<line x1={-VIEW_AZIMUTH_RADIUS} x2={VIEW_AZIMUTH_RADIUS} y1="0" y2="0" />
				<line x1="0" x2="0" y1={-VIEW_ALTITUDE_RADIUS} y2={VIEW_ALTITUDE_RADIUS} />
				<For each={GRAPH_TICKS}>
					{tick => (
						<>
							<line class={styles.tick} x1={tick} x2={tick} y1={-VIEW_ALTITUDE_RADIUS} y2={VIEW_ALTITUDE_RADIUS} />
							<line class={styles.tick} x1={-VIEW_AZIMUTH_RADIUS} x2={VIEW_AZIMUTH_RADIUS} y1={tick} y2={tick} />
						</>
					)}
				</For>
				<text text-anchor="end" x={VIEW_AZIMUTH_RADIUS - 0.06} y="-0.04">+Az</text>
				<text x="0.04" y="-0.91">+Alt</text>
			</g>

			<g
				aria-hidden="true"
				class={styles.horizon}
				data-eclipse-horizon={horizonVisible() ? "" : undefined}
				data-visible={horizonVisible() ? "" : undefined}
				style={{ transform: `translateY(${horizonY() * 50}%)` }}
			>
				<line x1={-VIEW_AZIMUTH_RADIUS} x2={VIEW_AZIMUTH_RADIUS} y1="0" y2="0" />
				<text
					x={-VIEW_AZIMUTH_RADIUS + 0.06}
					y={horizonY() < -0.85 ? 0.1 : -0.04}
				>
					{t().SOLAR_ECLIPSE.HORIZON}
				</text>
			</g>

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
		</svg>
	);
}
