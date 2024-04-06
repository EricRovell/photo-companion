
import { mergeProps } from "solid-js";

import { DEFAULT_PROPS, SUN_COLOR } from "./sun.const";
import type { SunEventName } from "types";
import styles from "./sun.module.css";

interface SunProps {
	event: SunEventName;
	size?: number;
}

export function Sun(allProps: SunProps) {
	const props = mergeProps(DEFAULT_PROPS, allProps);
	
	const center = () => props.size / 2;
	const radius = () => props.size / 2 - 5;
	const viewBox = () => `0 0 ${props.size} ${props.size}`;
	const color = () => SUN_COLOR[props.event] ?? DEFAULT_PROPS.fallbackColor;

	return (
		<svg
			class={styles.sun}
			style={{
				"--sun-color": color()
			}}
			viewBox={viewBox()}
		>
			<circle
				cx={center()}
				cy={center()}
				r={radius()}
			/>
		</svg>
	);
}
