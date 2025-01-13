import { createSignal, type JSX, onCleanup, onMount } from "solid-js";
import { classnames } from "utils";
import { isNonNegativeInteger } from "utils/validators";

import { getAngleFromTime } from "@lib/helpers";

import styles from "./gauge.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGCircleElement> {
	angle: number;
	cx: number;
	cy: number;
	r: number;
}

// Preventing from rendering both pointers when they are too close
const getOpacity = (currentTimeAngle: number, angle?: number) => {
	if (!isNonNegativeInteger(angle)) {
		return 1;
	}

	return Math.abs(currentTimeAngle - angle) <= 3
		? 0
		: 1;
};

export function CurrentPointer(props: Props) {
	const [ currentTimeAngle, setCurrentTimeAngle ] = createSignal(
		getAngleFromTime(new Date())
	);

	const path = () => `M ${props.cx - props.r},${props.cy + props.r} L ${props.cx + props.r},${props.cy - props.r} M ${props.cx - props.r},${props.cy - props.r} L ${props.cx + props.r},${props.cy + props.r}`;

	let timerId: Undefinable<number>;

	onMount(() => {
		// The are 86 400 000 ms per day
		// 1 degree = 240 000 ms
		timerId = window.setInterval(() => {
			setCurrentTimeAngle(value => value + 1);
		}, 240000);
	});

	onCleanup(() => {
		window.clearInterval(timerId);
	});

	return (
		<path
			class={classnames(styles.pointer, styles["current-pointer"])}
			d={path()}
			opacity={getOpacity(currentTimeAngle(), props.angle)}
			style={{
				"--gauge-pointer-angle": `${currentTimeAngle()}deg`
			}}
		/>
	);
}
