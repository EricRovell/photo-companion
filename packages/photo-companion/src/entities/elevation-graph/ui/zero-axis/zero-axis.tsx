import { type JSX, splitProps } from "solid-js";
import { classnames } from "utils";

import { X_RANGE } from "../../consts";

import styles from "./zero-axis.module.css";

export function ZeroAxis(allProps: JSX.SvgSVGAttributes<SVGLineElement>) {
	const [ props, rest ] = splitProps(allProps, [ "class" ]);

	return (
		<line
			class={classnames(styles["zero-axis"], props.class)}
			x1="0"
			x2={X_RANGE}
			y1="0"
			y2="0"
			{...rest}
		/>
	);
}
