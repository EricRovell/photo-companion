import type { ParentProps } from "solid-js";

import { useTranslation } from "~/features/translation";

import { ALTITUDE_WIDGET_CONFIG as CONFIG } from "../../config";
import { useAltitudeContext } from "../../model/altitude-context";

import styles from "./altitude-chart.module.css";

const PLOT = CONFIG.plot;

export function Chart(props: ParentProps) {
	const { format, t } = useTranslation();
	const { getAltitude, horizon, id, isSelected, props: widget, series } = useAltitudeContext();

	const description = () => series().filter(entity => isSelected(entity.id)).map(entity => (
		`${entity.label}: ${format().degrees(getAltitude(entity.id))}, ${getAltitude(entity.id) >= 0 ? t().RISE_SET.ABOVE_HORIZON : t().RISE_SET.BELOW_HORIZON}`
	)).join(". ");

	return (
		<svg
			aria-describedby={`${id}-description`}
			aria-labelledby={`${id}-chart-title`}
			class={styles.chart}
			role="img"
			viewBox={`0 0 ${CONFIG.chart.width} ${CONFIG.chart.height}`}
		>
			<title id={`${id}-chart-title`}>
				{`${widget.title}, ${format().timeShort(widget.date)}`}
			</title>
			<desc id={`${id}-description`}>{description()}</desc>
			<defs>
				<clipPath id={`${id}-above`}>
					<rect
						height={horizon() - PLOT.top}
						width={PLOT.width}
						x={PLOT.left}
						y={PLOT.top}
					/>
				</clipPath>
				<clipPath id={`${id}-below`}>
					<rect
						height={PLOT.bottom - horizon()}
						width={PLOT.width}
						x={PLOT.left}
						y={horizon()}
					/>
				</clipPath>
			</defs>
			<g aria-hidden="true">{props.children}</g>
		</svg>
	);
}
