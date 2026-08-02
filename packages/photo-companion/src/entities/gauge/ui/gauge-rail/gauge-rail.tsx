import { splitProps } from "solid-js";
import { classnames } from "utils";

import type { JSX} from "solid-js";

import { useGauge } from "../gauge-context";

import styles from "./gauge-rail.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGCircleElement> {
	r?: number;
}

export function GaugeRail(allProps: Props) {
	const [ props, rest ] = splitProps(allProps, [ "class", "r" ]);
	const state = useGauge();

	return (
		<circle
			class={classnames(styles.rail, props.class)}
			cx="0"
			cy="0"
			r={state.radius}
			stroke-width={state.railWidth}
			{...rest}
		/>
	);
}
