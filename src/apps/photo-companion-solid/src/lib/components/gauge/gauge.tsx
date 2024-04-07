import { Label } from "./gauge-label";
import { CurrentPointer } from "./gauge-pointer-current";
import { Marks, MarksWrapper } from "./gauge-marks";
import { checkIsPointerActive, describeArc } from "./gauge.helpers";

import styles from "./gauge.module.css";
import { type ParentProps, Show, mergeProps } from "solid-js";
import { Pointer } from "./gauge-pointer";
import { isNonNegativeInteger } from "utils/validators";
import { createTween } from "@lib/signals";

interface GaugeProps {
	angleStart?: number;
	angleEnd?: number;
	radius?: number;
	width?: number;
	labelStart?: string;
	labelEnd?: string;
	labelGap?: number;
	pointerGap?: number;
	pointerSize?: number;
	pointerAngle?: number;
}

const DEFAULT_PROPS = {
	angleStart: 0,
	angleEnd: 240,
	radius: 25,
	width: 10,
	labelStart: "",
	labelEnd: "",
	labelGap: 17,
	pointerGap: 8,
	pointerSize: 1,
	pointerAngle: 0
};

export function Gauge(allProps: ParentProps<GaugeProps>) {
	const props = mergeProps(DEFAULT_PROPS, allProps);

	const angleStart = createTween(() => props.angleStart);
	const angleEnd = createTween(() => props.angleEnd);

	return (
		<svg
			class={styles.gauge}
			viewBox="-50 -50 100 100"
		>
			<circle
				class={styles["progress-background"]}
				cx="0"
				cy="0"
				r={props.radius}
				stroke-width={props.width}
			/>
			<path
				class={styles.progress}
				d={describeArc(0, 0, props.radius, angleStart(), angleEnd())}
				stroke-width={props.width}
			/>
			<MarksWrapper>
				<Marks
					count={24}
					r1={props.radius + props.width / 2}
					r2={props.radius + 10}
				/>
				<Marks
					count={4}
					r1={props.radius + props.width / 2}
					r2={props.radius + 15}
				/>
			</MarksWrapper>
			<Show when={props.angleStart > props.angleEnd}>
				<line
					x1={0}
					y1={-props.radius + props.width / 2}
					x2={0}
					y2={-props.radius - props.width / 2}
					stroke="var(--color-surface-1)"
					stroke-width="0.75px"
					opacity="0.5"
				/>
			</Show>
			{props.children}
			<CurrentPointer
				angle={props.pointerAngle}
				cx={0}
				cy={-props.radius - props.pointerGap}
				r={1}
			/>
			<Show when={isNonNegativeInteger(props.pointerAngle)}>
				<Pointer
					angle={props.pointerAngle}
					cx={0}
					cy={-1 * (props.radius + props.pointerGap)}
					r={props.pointerSize}
					active={checkIsPointerActive(
						props.pointerAngle,
						props.angleStart,
						props.angleEnd
					)}
				/>
			</Show>
			<Label
				angle={angleStart()}
				label={props.labelStart}
				radius={props.radius + props.labelGap}
			/>
			<Label
				angle={angleEnd()}
				label={props.labelEnd}
				radius={props.radius + props.labelGap}
			/>
		</svg>
	);
}
