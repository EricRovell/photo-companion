import { mergeProps, splitProps } from "solid-js";
import { classnames } from "utils";

import type { JSX} from "solid-js";

import { GaugeProvider } from "../gauge-context";

import styles from "./gauge.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGSVGElement> {
	radius?: number;
	railWidth?: number
}

const DEFAULT_PROPS = {
	radius: 25,
	railWidth: 10
} as const;

export function Gauge(allProps: Props) {
	const mergedProps = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, local, rest ] = splitProps(mergedProps,
		[ "class", "children" ],
		[ "radius", "railWidth" ]
	);

	return (
		<GaugeProvider {...local}>
			<svg
				class={classnames(styles.gauge, props.class)}
				viewBox="-50 -50 100 100"
				{...rest}
			>
				{props.children}
			</svg>
		</GaugeProvider>
	);
}
