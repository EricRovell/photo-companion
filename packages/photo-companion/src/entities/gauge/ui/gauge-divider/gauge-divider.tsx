import { Show, splitProps } from "solid-js";
import { classnames } from "utils";

import type { JSX} from "solid-js";

import { useGauge } from "../gauge-context";

import styles from "./gauge-divider.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGLineElement> {
	isVisible?: boolean;
}

export function GaugeDivider(allProps: Props) {
	const [ props, rest ] = splitProps(allProps, [ "isVisible", "class" ]);
	const state = useGauge();

	return (
		<Show when={props.isVisible}>
			<line
				class={classnames(styles.divider, props.class)}
				x1={0}
				x2={0}
				y1={-state.radius + state.railWidth / 2}
				y2={-state.radius - state.railWidth / 2}
				{...rest}
			/>
		</Show>
	);
}
