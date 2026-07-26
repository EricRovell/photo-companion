import { type JSX, mergeProps, Show, splitProps } from "solid-js";
import { setAttribute } from "utils";
import { isNonNegativeInteger } from "utils/validators";

import { useGauge } from "../gauge-context";

import styles from "./gauge-pointer.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGCircleElement> {
	angle: number;
	gap?: number;
	isActive?: boolean;
	r?: number;
}

const DEFAULT_PROPS = {
	gap: 8,
	r: 1
};

export function GaugePointer(allProps: Props) {
	const mergedProps = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(mergedProps, [ "angle", "gap", "r", "isActive" ]);

	const state = useGauge();

	return (
		<Show when={isNonNegativeInteger(props.angle)}>
			<circle
				class={styles.pointer}
				cx={0}
				cy={-1 * (state.radius + props.gap)}
				data-active={setAttribute(props.isActive)}
				r={props.r}
				style={{ "--gauge-pointer-angle": `${props.angle}deg` }}
				{...rest}
			/>
		</Show>
	);
}
