import { mergeProps, type ParentProps, Show } from "solid-js";
import { createTweened } from "ui/primitives";
import { isNonNegativeInteger } from "utils/validators";

import { Label } from "./gauge-label";
import { Marks, MarksWrapper } from "./gauge-marks";
import { Pointer } from "./gauge-pointer";
import { CurrentPointer } from "./gauge-pointer-current";
import { checkIsPointerActive, describeArc } from "./gauge.helpers";

import styles from "./gauge.module.css";

interface GaugeProps {
	angleEnd?: number;
	angleStart?: number;
	labelEnd?: string;
	labelGap?: number;
	labelStart?: string;
	pointerAngle?: number;
	pointerGap?: number;
	pointerSize?: number;
	radius?: number;
	width?: number;
}

const DEFAULT_PROPS = {
	angleEnd: 240,
	angleStart: 0,
	labelEnd: "",
	labelGap: 17,
	labelStart: "",
	pointerAngle: 0,
	pointerGap: 8,
	pointerSize: 1,
	radius: 25,
	width: 10
};

export function Gauge(allProps: ParentProps<GaugeProps>) {
	const props = mergeProps(DEFAULT_PROPS, allProps);

	const angleStart = createTweened(() => props.angleStart);
	const angleEnd = createTweened(() => props.angleEnd);

	const r2 = () => props.radius + props.width / 2;

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
				d={describeArc(0, 0, props.radius - props.width / 2, r2(), angleStart(), angleEnd())}
			/>
			<MarksWrapper>
				<Marks
					count={24}
					r1={r2()}
					r2={props.radius + 10}
				/>
				<Marks
					count={4}
					r1={r2()}
					r2={props.radius + 15}
				/>
			</MarksWrapper>
			<Show when={props.angleStart > props.angleEnd}>
				<line
					opacity="0.5"
					stroke="var(--color-surface-1)"
					stroke-width="0.5"
					x1={0}
					x2={0}
					y1={-props.radius + props.width / 2}
					y2={-props.radius - props.width / 2}
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
					active={checkIsPointerActive(
						props.pointerAngle,
						props.angleStart,
						props.angleEnd
					)}
					angle={props.pointerAngle}
					cx={0}
					cy={-1 * (props.radius + props.pointerGap)}
					r={props.pointerSize}
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
