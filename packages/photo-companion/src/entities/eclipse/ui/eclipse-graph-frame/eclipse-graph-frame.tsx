import { createMemo, createUniqueId, For, type JSX, Show } from "solid-js";

import styles from "./eclipse-graph-frame.module.css";

interface EclipseGraphFrameProps {
	altitudeTicks: readonly number[];
	azimuthTicks: readonly number[];
	centerAltitude: number;
	children: JSX.Element;
	class?: string;
	description: string;
	horizonLabel: string;
	title: string;
	viewAltitudeRadius: number;
	viewAzimuthRadius: number;
}

export function EclipseGraphFrame(props: EclipseGraphFrameProps) {
	const titleId = createUniqueId();
	const descriptionId = createUniqueId();

	const viewBox = createMemo(() => [
		-props.viewAzimuthRadius,
		-props.viewAltitudeRadius,
		2 * props.viewAzimuthRadius,
		2 * props.viewAltitudeRadius
	].join(" "));

	const horizonVisible = createMemo(() => Math.abs(props.centerAltitude) <= props.viewAltitudeRadius);
	const horizonTranslation = createMemo(() => 50 * props.centerAltitude / props.viewAltitudeRadius);

	return (
		<svg
			aria-labelledby={`${titleId} ${descriptionId}`}
			class={`${styles.graph} ${props.class ?? ""}`}
			role="img"
			viewBox={viewBox()}
		>
			<title id={titleId}>{props.title}</title>
			<desc id={descriptionId}>{props.description}</desc>

			<rect
				class={styles.background}
				height={2 * props.viewAltitudeRadius}
				width={2 * props.viewAzimuthRadius}
				x={-props.viewAzimuthRadius}
				y={-props.viewAltitudeRadius}
			/>
			<g aria-hidden="true" class={styles.grid}>
				<line x1={-props.viewAzimuthRadius} x2={props.viewAzimuthRadius} y1="0" y2="0" />
				<line x1="0" x2="0" y1={-props.viewAltitudeRadius} y2={props.viewAltitudeRadius} />
				<For each={props.azimuthTicks}>
					{tick => (
						<line class={styles.tick} x1={tick} x2={tick} y1={-props.viewAltitudeRadius} y2={props.viewAltitudeRadius} />
					)}
				</For>
				<For each={props.altitudeTicks}>
					{tick => (
						<line class={styles.tick} x1={-props.viewAzimuthRadius} x2={props.viewAzimuthRadius} y1={tick} y2={tick} />
					)}
				</For>
				<text text-anchor="end" x={props.viewAzimuthRadius - 0.06} y="-0.04">+Az</text>
				<text x="0.04" y={-props.viewAltitudeRadius + 0.09}>+Alt</text>
			</g>

			<Show when={horizonVisible()}>
				<g
					aria-hidden="true"
					class={styles.horizon}
					data-eclipse-horizon
					style={{ transform: `translateY(${horizonTranslation()}%)` }}
				>
					<line x1={-props.viewAzimuthRadius} x2={props.viewAzimuthRadius} y1="0" y2="0" />
					<text
						x={-props.viewAzimuthRadius + 0.06}
						y={props.centerAltitude < -0.85 * props.viewAltitudeRadius ? 0.1 : -0.04}
					>
						{props.horizonLabel}
					</text>
				</g>
			</Show>

			{props.children}
		</svg>
	);
}
