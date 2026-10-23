import { createMemo, createUniqueId, Show } from "solid-js";
import { isNullable } from "utils/validators";

import type { ParentProps } from "solid-js";

import { createTweened } from "~/shared/primitives";

import { RISE_SET_WIDGET_CONFIG } from "../../config";
import { buildRiseSetArcPath, calculateRiseSetProgress, getRiseSetDialPoint, getRiseSetDialViewBox, getRiseSetMidnights } from "../../lib";
import { RiseSetDialMidnights } from "../rise-set-dial-midnights/rise-set-dial-midnights";
import { RiseSetDialTicks } from "../rise-set-dial-ticks/rise-set-dial-ticks";

import styles from "./rise-set-dial.module.css";

interface Props {
	aboveHorizon: boolean;
	ariaLabel: string;
	currentTime: string;
	date: Date;
	describedBy?: string;
	rise: Nullish<Date>;
	set: Nullish<Date>;
}

const CONFIG = RISE_SET_WIDGET_CONFIG;
const DIAL = CONFIG.dial;
const HORIZON_PATH = buildRiseSetArcPath(DIAL.horizonRadius);
const TRACK_PATH = buildRiseSetArcPath(CONFIG.track.radius);

export function RiseSetDial(props: ParentProps<Props>) {
	const midnightDescriptionId = createUniqueId();
	const midnights = createMemo(() => getRiseSetMidnights(props.rise, props.set));
	const describedBy = () => [ props.describedBy, midnights().length ? midnightDescriptionId : null ].filter(Boolean).join(" ") || undefined;
	const progress = createMemo(() => calculateRiseSetProgress(props.date, props.rise, props.set));

	const position = createTweened(() => progress().arc, { duration: CONFIG.animation.transitionDuration });

	const marker = () => getRiseSetDialPoint(DIAL.angleStart + position() * DIAL.angleSpan, CONFIG.track.radius);

	const markerVisible = () => {
		const value = progress().position;
		return !isNullable(value) && (props.aboveHorizon || value === 0 || value === 1);
	};

	return (
		<div
			class={styles.diagram}
			style={{
				"--rise-set-body-duration": `${CONFIG.animation.bodyDuration}ms`,
				"--rise-set-body-opacity": CONFIG.body.belowHorizonOpacity,
				"--rise-set-body-scale": CONFIG.body.scale,
				"--rise-set-body-top": `${DIAL.center / DIAL.viewBoxHeight * 100}%`,
				"--rise-set-marker-glow": `${CONFIG.marker.glowSize}px`,
				"--rise-set-progress-opacity": CONFIG.track.progressOpacity,
				"--rise-set-progress-width": CONFIG.track.progressWidth,
				"--rise-set-track-opacity": CONFIG.track.baseOpacity,
				"--rise-set-track-width": CONFIG.track.baseWidth
			}}
		>
			<svg
				aria-describedby={describedBy()}
				aria-label={props.ariaLabel}
				class={styles.dial}
				role="img"
				viewBox={getRiseSetDialViewBox()}
			>
				<path class={styles.horizon} d={HORIZON_PATH} />
				<g class={styles.guides}>
					<line
						x1={DIAL.center - DIAL.horizonRadius}
						x2={DIAL.center - DIAL.guideGap.horizontal}
						y1={DIAL.center}
						y2={DIAL.center}
					/>
					<line
						x1={DIAL.center + DIAL.guideGap.horizontal}
						x2={DIAL.center + DIAL.horizonRadius}
						y1={DIAL.center}
						y2={DIAL.center}
					/>
					<line
						x1={DIAL.center}
						x2={DIAL.center}
						y1={DIAL.center - DIAL.horizonRadius}
						y2={DIAL.center - DIAL.guideGap.vertical}
					/>
				</g>
				<RiseSetDialTicks />
				<path
					class={styles.track}
					d={TRACK_PATH}
				/>
				<Show when={progress().arc > 0}>
					<path
						class={styles.progress}
						d={TRACK_PATH}
						data-rise-set-progress
						pathLength="1"
						stroke-dasharray={`${position()} 1`}
					/>
				</Show>
				<Show when={midnights().length}>
					<RiseSetDialMidnights descriptionId={midnightDescriptionId} midnights={midnights()} />
				</Show>
				<Show when={markerVisible()}>
					<circle
						class={styles.marker}
						cx={marker().x}
						cy={marker().y}
						data-position-marker
						r={CONFIG.marker.radius}
					>
						<title>{props.currentTime}</title>
					</circle>
				</Show>
			</svg>
			<div
				aria-hidden="true"
				class={styles.body}
				data-below-horizon={!props.aboveHorizon || undefined}
			>
				{props.children}
			</div>
		</div>
	);
}
