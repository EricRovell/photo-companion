import { type JSX, type ParentProps, splitProps } from "solid-js";
import { classnames } from "utils";

import { X_RANGE, Y_MIN, Y_RANGE, Y_RANGE_TICKS } from "../../consts";

import styles from "./graph.module.css";

export const Graph = (allProps: ParentProps<JSX.SvgSVGAttributes<SVGSVGElement>>) => {
	const [ props, rest ] = splitProps(allProps, [ "class", "children" ]);

	return (
		<svg
			class={classnames(styles.graph, props.class)}
			viewBox={`0 ${Y_MIN - Y_RANGE_TICKS} ${X_RANGE} ${Y_RANGE}`}
			{...rest}
		>
			{props.children}
		</svg>
	);
};
