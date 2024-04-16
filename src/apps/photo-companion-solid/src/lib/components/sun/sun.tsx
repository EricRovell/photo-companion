
import { type JSX, mergeProps, splitProps } from "solid-js";

import { DEFAULT_PROPS, SUN_COLOR } from "./sun.const";
import type { SunEventName } from "types";
import styles from "./sun.module.css";

interface SunProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
	event?: SunEventName;
	size?: number;
}

export function Sun(allProps: SunProps) {
	const merged = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(merged, [ "event", "size" ]);
	
	const center = () => props.size / 2;
	const radius = () => props.size / 2 - 5;
	const viewBox = () => `0 0 ${props.size} ${props.size}`;

	return (
		<svg
			class={styles.sun}
			style={{ "--sun-color": SUN_COLOR[props.event] }}
			viewBox={viewBox()}
			{...rest}
		>
			<circle
				cx={center()}
				cy={center()}
				r={radius()}
			/>
		</svg>
	);
}
