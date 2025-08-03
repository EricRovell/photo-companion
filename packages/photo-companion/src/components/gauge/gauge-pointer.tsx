import { type JSX, splitProps } from "solid-js";
import { setAttribute } from "utils";

import styles from "./gauge.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGCircleElement> {
	active: boolean;
	angle: number;
	cx: number;
	cy: number;
	r: number;
}

export function Pointer(allProps: Props) {
	const [ props, rest ] = splitProps(allProps, [
		"active",
		"angle"
	]);

	return (
		<circle
			class={styles.pointer}
			data-active={setAttribute(props.active)}
			style={{
				"--gauge-pointer-angle": `${props.angle}deg`
			}}
			{...rest}
		/>
	);
}
