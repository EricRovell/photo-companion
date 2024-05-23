import { round } from "utils/math";

import { getDate } from "@lib/helpers";
import { createWavyPath } from "@lib/helpers/svg";
import styles from "./card-bridge.module.css";

import { mergeProps, For } from "solid-js";
import type { BridgeSparklineProps, ScheduleEntry, SparklineProps, TimeProps, WaterPathProps } from "./card-bridge.types";
import { DEFAULT_PROPS_SPARKLINE } from "./card-bridge.const";
import { buildBridgeSparklinePath } from "./card-bridge.utils";
import { useTranslation } from "@lib/context";

const Sparkline = (props: SparklineProps) => (
	<path
		d={buildBridgeSparklinePath(props)}
		stroke-linecap="round"
		fill="none"
	/>
);

function Time(props: TimeProps) {
	const { formatters } = useTranslation();

	return (
		<text
			x={props.x}
			y={props.y}
			font-size={props.fontSize.toString()}
			fill="white"
		>
			{formatters().formatTimeShort(props.date)}
			<title>
				{formatters().formatTimeShort(props.date)}
			</title>
		</text>
	);
}

const WaterPath = (props: WaterPathProps) => (
	<path
		data-stroke-water
		d={createWavyPath(`M ${props.x1 + 6},0 L ${props.x2 - 6},${0}`, 5, 2)}
		stroke-linecap="round"
		fill="none"
	/>
);

function SparklineEntry(props: ScheduleEntry) {
	const x1 = () => props.hoursStart * 60 + props.minutesStart;
	const x2 = () => props.hoursEnd * 60 + props.minutesEnd;
	const dateStart = () => getDate({
		hours: props.hoursStart,
		minutes: props.minutesStart,
		seconds: 0
	});
	const dateEnd = () => getDate({
		hours: props.hoursEnd,
		minutes: props.minutesEnd,
		seconds: 0
	});

	return (
		<>
			<WaterPath x1={x1()} x2={x2()} />
			<Time
				x={x1() - props.fontSize}
				y={props.fontSize * 1.5}
				fontSize={props.fontSize}
				date={dateStart()}
			/>
			<Time
				x={x2() - props.fontSize}
				y={props.fontSize * 1.5}
				fontSize={props.fontSize}
				date={dateEnd()}
			/>
		</>
	);
}

export function BridgeSparkline(allProps: BridgeSparklineProps) {
	const props = mergeProps(DEFAULT_PROPS_SPARKLINE, allProps);

	const dx = () => round(props.length * Math.cos(props.angle), 2);
	const dy = () => round(props.length * Math.sin(props.angle));
	const viewBox = () => `${props.start * 60} -${dy()} ${(props.end - props.start) * 60} ${dy() + props.stroke + props.fontSize * 2}`;

	return (
		<svg
			class={styles.sparkline}
			style={{
				"--sparkline-stroke-width": props.strokeWidth
			}}
			viewBox={viewBox()}
		>
			<Sparkline
				schedule={props.schedule}
				dx={dx()}
				dy={dy()}
				start={props.start}
				end={props.end}
			/>
			<For each={props.schedule}>
				{([ hoursStart, minutesStart, hoursEnd, minutesEnd ]) => (
					<SparklineEntry
						hoursStart={hoursStart}
						minutesStart={minutesStart}
						hoursEnd={hoursEnd}
						minutesEnd={minutesEnd}
						fontSize={props.fontSize}
					/>
				)}
			</For>
		</svg>
	);
}
