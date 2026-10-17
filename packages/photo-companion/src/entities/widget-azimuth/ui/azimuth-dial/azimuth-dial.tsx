import { For } from "solid-js";
import { polarToCartesian } from "utils/math";

import { AZIMUTH_WIDGET_CONFIG } from "../../config";
import { AZIMUTH_TICKS, CARDINAL_POINTS } from "../../consts";
import { buildHorizonTrackPath } from "../../lib";

import type { AzimuthEntity, AzimuthPathPoint, AzimuthWidgetEntity, CardinalLabels } from "../../types";

import styles from "./azimuth-dial.module.css";

const DIAL_CONFIG = AZIMUTH_WIDGET_CONFIG.dial;
const TRACK_RADIUS = AZIMUTH_WIDGET_CONFIG.track.radius;
const getDialPoint = (angle: number, radius: number) => polarToCartesian(
	DIAL_CONFIG.center,
	DIAL_CONFIG.center,
	radius,
	angle
);

interface Props {
	cardinalLabels: CardinalLabels;
	entities: AzimuthWidgetEntity[];
	getAzimuth: (entity: AzimuthEntity) => number;
	getPath: (entity: AzimuthEntity) => AzimuthPathPoint[];
	heading: number;
}

export function AzimuthDial(props: Props) {
	const getMarkerPoint = (entity: AzimuthWidgetEntity) => getDialPoint(
		props.getAzimuth(entity.id) - props.heading,
		TRACK_RADIUS[entity.id]
	);

	const ariaLabel = () => props.entities
		.map(entity => `${entity.label}: ${Math.round(props.getAzimuth(entity.id)) % 360}°`)
		.join(", ");

	return (
		<svg
			aria-label={ariaLabel()}
			class={styles.dial}
			role="img"
			viewBox={`0 0 ${DIAL_CONFIG.viewBoxSize} ${DIAL_CONFIG.viewBoxSize}`}
		>
			<circle
				class={styles.horizon}
				cx={DIAL_CONFIG.center}
				cy={DIAL_CONFIG.center}
				r={DIAL_CONFIG.horizonRadius}
			/>
			<g class={styles.guides}>
				<line x1={DIAL_CONFIG.guideStart} x2={DIAL_CONFIG.guideEnd} y1={DIAL_CONFIG.center} y2={DIAL_CONFIG.center} />
				<line x1={DIAL_CONFIG.center} x2={DIAL_CONFIG.center} y1={DIAL_CONFIG.guideStart} y2={DIAL_CONFIG.guideEnd} />
			</g>
			<circle
				class={styles.center}
				cx={DIAL_CONFIG.center}
				cy={DIAL_CONFIG.center}
				r={DIAL_CONFIG.centerPointRadius}
			/>

			<For each={AZIMUTH_TICKS}>
				{tick => (
					<line
						class={tick.major ? styles.major : styles.tick}
						x1={getDialPoint(tick.angle - props.heading, tick.major ? DIAL_CONFIG.tick.majorInnerRadius : DIAL_CONFIG.tick.innerRadius).x}
						x2={getDialPoint(tick.angle - props.heading, DIAL_CONFIG.tick.outerRadius).x}
						y1={getDialPoint(tick.angle - props.heading, tick.major ? DIAL_CONFIG.tick.majorInnerRadius : DIAL_CONFIG.tick.innerRadius).y}
						y2={getDialPoint(tick.angle - props.heading, DIAL_CONFIG.tick.outerRadius).y}
					/>
				)}
			</For>

			<For each={CARDINAL_POINTS}>
				{point => (
					<text
						class={point.key === "north" ? styles.north : styles.cardinal}
						textContent={props.cardinalLabels[point.key]}
						x={getDialPoint(point.angle - props.heading, DIAL_CONFIG.cardinalRadius).x}
						y={getDialPoint(point.angle - props.heading, DIAL_CONFIG.cardinalRadius).y}
					/>
				)}
			</For>

			<For each={props.entities}>
				{entity => (
					<g class={styles.entity} data-entity={entity.id}>
						<circle
							class={styles["track-base"]}
							cx={DIAL_CONFIG.center}
							cy={DIAL_CONFIG.center}
							r={TRACK_RADIUS[entity.id]}
						/>
						<path
							class={styles["track-below"]}
							d={buildHorizonTrackPath(props.getPath(entity.id), false, props.heading, DIAL_CONFIG.center, TRACK_RADIUS[entity.id])}
						/>
						<path
							class={styles["track-above"]}
							d={buildHorizonTrackPath(props.getPath(entity.id), true, props.heading, DIAL_CONFIG.center, TRACK_RADIUS[entity.id])}
						/>
						<circle
							class={entity.altitude < 0 ? styles["marker-below"] : styles.marker}
							cx={getMarkerPoint(entity).x}
							cy={getMarkerPoint(entity).y}
							r={AZIMUTH_WIDGET_CONFIG.marker.radius}
						/>
					</g>
				)}
			</For>
		</svg>
	);
}
