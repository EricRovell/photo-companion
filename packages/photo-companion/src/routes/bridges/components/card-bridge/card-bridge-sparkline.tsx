import { For, mergeProps } from "solid-js";
import { round } from "utils/math";

import { useTranslation } from "@lib/context/translation";
import { getDate } from "@lib/helpers";
import { createWavyPath } from "@lib/helpers/svg";

import { DEFAULT_PROPS_SPARKLINE } from "./card-bridge.const";
import { buildBridgeSparklinePath } from "./card-bridge.utils";

import type { BridgeSparklineProps, ScheduleEntry, SparklineProps, TimeProps, WaterPathProps } from "./card-bridge.types";

import styles from "./card-bridge.module.css";

const Sparkline = (props: SparklineProps) => (
	<path
		d={buildBridgeSparklinePath(props)}
		fill="none"
		stroke-linecap="round"
	/>
);

function Time(props: TimeProps) {
	const { formatters } = useTranslation();

	return (
		<text
			fill="white"
			font-size={props.fontSize.toString()}
			x={props.x}
			y={props.y}
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
		d={createWavyPath(`M ${props.x1 + 6},0 L ${props.x2 - 6},0`, 5, 2)}
		data-stroke-water
		fill="none"
		stroke-linecap="round"
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
				date={dateStart()}
				fontSize={props.fontSize}
				x={x1() - props.fontSize}
				y={props.fontSize * 1.5}
			/>
			<Time
				date={dateEnd()}
				fontSize={props.fontSize}
				x={x2() - props.fontSize}
				y={props.fontSize * 1.5}
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
				dx={dx()}
				dy={dy()}
				end={props.end}
				schedule={props.schedule}
				start={props.start}
			/>
			<For each={props.schedule}>
				{([ hoursStart, minutesStart, hoursEnd, minutesEnd ]) => (
					<SparklineEntry
						fontSize={props.fontSize}
						hoursEnd={hoursEnd}
						hoursStart={hoursStart}
						minutesEnd={minutesEnd}
						minutesStart={minutesStart}
					/>
				)}
			</For>
		</svg>
	);
}
