import { For, Show } from "solid-js";

import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

import { ALTITUDE_WIDGET_CONFIG as CONFIG } from "../../config";
import { getHourTicks } from "../../lib/get-hour-ticks";
import { useAltitudeContext } from "../../model/altitude-context";

import styles from "./altitude-grid.module.css";

const PLOT = CONFIG.plot;

export function Grid() {
	const { t } = useTranslation();
	const { altitudeTicks, day, horizon, isHorizonVisible, x, y } = useAltitudeContext();

	return (
		<g>
			<Text
				align="start"
				as="text"
				class={styles.label}
				color="secondary"
				variant="text-s"
				x={PLOT.left}
				y={CONFIG.axis.titleY}
			>
				{t().ALTITUDE.AXIS_ALTITUDE}
			</Text>
			<rect
				class={styles.sky}
				height={horizon() - PLOT.top}
				width={PLOT.width}
				x={PLOT.left}
				y={PLOT.top}
			/>
			<For each={altitudeTicks()}>
				{altitude => (
					<g>
						<line
							class={altitude === 0 ? styles.horizon : styles.guide}
							x1={PLOT.left}
							x2={PLOT.right}
							y1={y(altitude)}
							y2={y(altitude)}
						/>
						<Text
							align="end"
							as="text"
							class={styles.label}
							color="secondary"
							numeric
							variant="text-s"
							x={PLOT.left - 10}
							y={y(altitude)}
						>
							{`${altitude > 0 ? "+" : ""}${altitude}°`}
						</Text>
					</g>
				)}
			</For>
			<Show when={isHorizonVisible()}>
				<Text
					align="end"
					as="text"
					class={styles.label}
					color="secondary"
					variant="text-xs"
					x={PLOT.right}
					y={horizon() - 9}
				>
					{t().ALTITUDE.HORIZON}
				</Text>
			</Show>
			<For each={getHourTicks(day().start)}>
				{tick => (
					<g>
						<line
							class={styles.guide}
							x1={x(tick.timestamp)}
							x2={x(tick.timestamp)}
							y1={PLOT.top}
							y2={PLOT.bottom}
						/>
						<Text
							align="center"
							as="text"
							class={styles.label}
							color="secondary"
							numeric
							variant="text-s"
							x={x(tick.timestamp)}
							y={PLOT.bottom + CONFIG.axis.tickLabelOffset}
						>
							{tick.label}
						</Text>
					</g>
				)}
			</For>
			<Text
				align="center"
				as="text"
				class={styles.label}
				color="secondary"
				variant="text-s"
				x={PLOT.left + PLOT.width / 2}
				y={PLOT.bottom + CONFIG.axis.timeTitleOffset}
			>
				{t().ALTITUDE.AXIS_TIME}
			</Text>
		</g>
	);
}
