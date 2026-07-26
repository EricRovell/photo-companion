import { splitProps } from "solid-js";
import { classnames } from "utils";

import type { JSX} from "solid-js";

import { describeArc } from "../../lib";
import { useGauge } from "../gauge-context";

import styles from "./gauge-slice.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGPathElement> {
	angleEnd: number;
	angleStart: number;
}

export function GaugeSlice(allProps: Props) {
	const [ props, rest ] = splitProps(allProps, [ "class", "angleEnd", "angleStart" ]);
	const state = useGauge();

	return (
		<path
			class={classnames(styles.slice, props.class)}
			d={describeArc(
				0,
				0,
				state.radius - state.railWidth / 2,
				state.railCenter(),
				props.angleStart,
				props.angleEnd
			)}
			{...rest}
		/>
	);
}
