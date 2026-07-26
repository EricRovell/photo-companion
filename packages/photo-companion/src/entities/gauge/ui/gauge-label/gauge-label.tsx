import { type JSX, mergeProps } from "solid-js";

import { polarToCartesian } from "../../lib";
import { useGauge } from "../gauge-context";

interface Props extends JSX.SvgSVGAttributes<SVGTextElement> {
	angle?: number;
	gap?: number;
}

const DEFAULT_PROPS = {
	angle: 0,
	gap: 17
};

export function GaugeLabel(allProps: Props) {
	const props = mergeProps(DEFAULT_PROPS, allProps);
	const state = useGauge();

	const coords = () => polarToCartesian(0, 0, state.radius + props.gap, props.angle);

	const transform = () => props.angle > 180
		? `rotate(${props.angle - 270})`
		: `rotate(${props.angle - 90})`;

	return (
		<text
			{...coords()}
			dominant-baseline="central"
			transform={transform()}
			transform-origin="center"
		>
			{props.children}
		</text>
	);
}
