import { mergeProps, type JSX } from "solid-js";
import { polarToCartesian } from "./gauge.helpers";
import styles from "./gauge.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGTextElement> {
	angle?: number;
	label?: string;
	radius: number;
}

const DEFAULT_PROPS = {
	angle: 0
};

export function Label(allProps: Props) {
	const props = mergeProps(DEFAULT_PROPS, allProps);

	const coords = () => polarToCartesian(0, 0, props.radius, props.angle);
	const transform = () => props.angle > 180
		? `rotate(${props.angle - 270})`
		: `rotate(${props.angle - 90})`;

	return (
		<text
			class={styles.label}
			{...coords()}
			transform={transform()}
			transform-origin="center"
			dominant-baseline="central"
		>
			{props.label}
		</text>
	);
}
