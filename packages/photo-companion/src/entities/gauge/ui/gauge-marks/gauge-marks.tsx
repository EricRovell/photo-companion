import { splitProps } from "solid-js";
import { Index} from "solid-js";
import { classnames } from "utils";

import type { JSX } from "solid-js";

import { createTickCoords } from "../../lib";
import { useGauge } from "../gauge-context";

import styles from "./gauge-marks.module.css";

export function GaugeMarksWrapper(allProps: JSX.SvgSVGAttributes<SVGGElement>) {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<g class={classnames(styles.marks, props.class)} {...rest}>
			{props.children}
		</g>
	);
}

interface MarksProps {
	count: number;
	length: number;
}

export function GaugeMarks(props: MarksProps) {
	const state = useGauge();

	return (
		<Index each={createTickCoords(props.count, state.railCenter(), state.radius + props.length)}>
			{index => <line {...index()} />}
		</Index>
	);
}
