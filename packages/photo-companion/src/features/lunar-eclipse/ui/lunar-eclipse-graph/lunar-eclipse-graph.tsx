import { createMemo, createUniqueId, Show } from "solid-js";
import { isNullable } from "utils/validators";

import { EclipseGraphFrame } from "~/entities/eclipse";
import { useTranslation } from "~/features/translation";

import { GRAPH_CONFIG } from "../../config";
import { getLunarEclipseGraphPoint, getLunarEclipseTrack } from "../../lib";

import type { LunarEclipseGraphProps } from "../../types";

import styles from "./lunar-eclipse-graph.module.css";

export function LunarEclipseGraph(props: LunarEclipseGraphProps) {
	const { t } = useTranslation();

	const gradientId = createUniqueId();
	const moonClipId = createUniqueId();
	const moonPoint = createMemo(() => getLunarEclipseGraphPoint(props.state));

	const track = createMemo(() => isNullable(props.event)
		? null
		: getLunarEclipseTrack(props.event, props.latitude, props.longitude));

	return (
		<EclipseGraphFrame
			altitudeTicks={GRAPH_CONFIG.altitudeTicks}
			azimuthTicks={GRAPH_CONFIG.azimuthTicks}
			centerAltitude={props.state.shadow.altitude}
			class={styles.graph}
			description={t().LUNAR_ECLIPSE.GRAPH_DESCRIPTION}
			horizonLabel={t().LUNAR_ECLIPSE.HORIZON}
			title={t().LUNAR_ECLIPSE.GRAPH_TITLE}
			viewAltitudeRadius={GRAPH_CONFIG.viewAltitudeRadius}
			viewAzimuthRadius={GRAPH_CONFIG.viewAzimuthRadius}
		>
			<defs>
				<radialGradient id={gradientId}>
					<stop class={styles["penumbra-inner"]} offset="0%" />
					<stop class={styles["penumbra-middle"]} offset="65%" />
					<stop class={styles["penumbra-outer"]} offset="100%" />
				</radialGradient>
				<clipPath id={moonClipId}>
					<circle cx={moonPoint().x} cy={moonPoint().y} r={props.state.moon.angularRadius} />
				</clipPath>
			</defs>

			<circle
				aria-hidden="true"
				class={styles.penumbra}
				fill={`url(#${gradientId})`}
				r={props.state.shadow.penumbraAngularRadius}
			/>
			<circle
				aria-hidden="true"
				class={styles.umbra}
				r={props.state.shadow.umbraAngularRadius}
			/>
			<Show keyed when={track()}>
				{path => <path aria-hidden="true" class={styles.track} d={path} data-eclipse-track />}
			</Show>
			<circle
				aria-hidden="true"
				class={styles.moon}
				cx={moonPoint().x}
				cy={moonPoint().y}
				r={props.state.moon.angularRadius}
			/>
			<g aria-hidden="true" clip-path={`url(#${moonClipId})`}>
				<circle fill={`url(#${gradientId})`} r={props.state.shadow.penumbraAngularRadius} />
				<circle class={styles["umbra-coverage"]} r={props.state.shadow.umbraAngularRadius} />
			</g>
			<circle
				aria-hidden="true"
				class={styles["moon-outline"]}
				cx={moonPoint().x}
				cy={moonPoint().y}
				r={props.state.moon.angularRadius}
			/>
		</EclipseGraphFrame>
	);
}
