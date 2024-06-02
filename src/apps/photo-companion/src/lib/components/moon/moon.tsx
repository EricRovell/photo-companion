import { mergeProps } from "solid-js";
import { createTweened } from "ui/primitives";

import { DEFAULT_PROPS } from "./moon.const";
import { getNormalizedAngleRad, getNormalizedPhase } from "./moon.helpers";

import type { CircleCommonProps, CircleProps, MoonProps } from "./moon.types";

import styles from "./moon.module.css";

export function createCircle(commonProps: CircleCommonProps) {
	return (props: CircleProps) => (
		<circle {...commonProps} {...props} />
	);
}

export function Moon(allProps: MoonProps) {
	const props = mergeProps(DEFAULT_PROPS, allProps);
	const phase = createTweened(() => props.phase);

	const viewBox = () => `0 0 ${props.size} ${props.size}`;
	const center = () => props.size / 2;
	const radius = () => props.size / 2 - 10;

	const visibleLeft = () => phase() >= 0.5 && phase() < 1 - props.precision;
	const visibleRight = () => phase() <= 0.5 && phase() >= props.precision;
	const dark = () => 0.5 / getNormalizedPhase(phase()) > 2;

	const Circle = createCircle({
		cx: center(),
		cy: center(),
		r: radius()
	});

	return (
		<svg
			class={styles.moon}
			style={{
				"--moon-disk-angle": `${getNormalizedAngleRad(phase())}rad`,
				"--moon-rotation": `${props.rotation}deg`,
				"transform": `rotate(${props.rotation}deg)`
			}}
			viewBox={viewBox()}
		>
			<Circle class={styles.shadow} />
			<Circle
				class={styles.semicircle}
				classList={{
					[styles.visible]: visibleLeft()
				}}
				data-left
			/>
			<Circle
				class={styles.semicircle}
				classList={{
					[styles.visible]: visibleRight()
				}}
				data-right
			/>
			<Circle
				class={styles.diff}
				classList={{
					[styles.dark]: dark()
				}}
			/>
		</svg>
	);
}
