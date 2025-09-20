import { type JSX, mergeProps, splitProps } from "solid-js";

import { createTweened } from "~/shared/primitives";

import { getNormalizedAngleRad, getNormalizedPhase } from "../../lib";

import styles from "./moon.module.css";

export interface MoonProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
	phase?: number;
	precision?: number;
	rotation?: number;
	size?: number;
}

export interface CircleCommonProps extends JSX.SvgSVGAttributes<SVGCircleElement> {
	cx: number;
	cy: number;
	r: number;
}

export type CircleProps = JSX.SvgSVGAttributes<SVGCircleElement>;


const DEFAULT_PROPS = {
	phase: 0,
	precision: 0.025,
	rotation: 0,
	size: 100
};

export function createCircle(commonProps: CircleCommonProps) {
	return (props: CircleProps) => (
		<circle {...commonProps} {...props} />
	);
}

export function Moon(allProps: MoonProps) {
	const mergedProps = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(mergedProps, [ "size", "precision", "phase", "rotation" ]);
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
			{...rest}
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
