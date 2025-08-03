
import { type JSX, mergeProps, splitProps } from "solid-js";

import type { SunEventName } from "types";

import { SUN_COLOR } from "../../consts";

import styles from "./sun.module.css";

interface SunProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
	event?: SunEventName;
	size?: number;
}

const DEFAULT_PROPS = {
	event: "SOLAR_NOON" as SunEventName,
	fallbackColor: "gold",
	size: 100
};

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
