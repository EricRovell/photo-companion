import { merge, omit } from "solid-js";

import type { JSX } from "@solidjs/web";

import { circular, createTweened } from "~/shared/primitives";

import { getNormalizedAngleRad, getNormalizedPhase, wrapPhase } from "../../lib";

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

type CircleProps = JSX.SvgSVGAttributes<SVGCircleElement>;


const DEFAULT_PROPS = {
	phase: 0,
	precision: 0.025,
	rotation: 0,
	size: 100
};

function createCircle(commonProps: CircleCommonProps) {
	return (props: CircleProps) => (
		<circle {...commonProps} {...props} />
	);
}

export function Moon(allProps: MoonProps) {
	const props = merge(DEFAULT_PROPS, allProps);
	const rest = omit(props, "class", "size", "precision", "phase", "rotation");

	const phase = createTweened(() => props.phase, {
		interpolate: circular(1),
		map: wrapPhase
	});

	const viewBox = () => `0 0 ${props.size} ${props.size}`;
	const center = () => props.size / 2;
	const radius = () => props.size / 2 - 10;

	const visibleLeft = () => phase() >= 0.5 && phase() < 1 - props.precision;
	const visibleRight = () => phase() <= 0.5 && phase() >= props.precision;
	const dark = () => 0.5 / getNormalizedPhase(phase()) > 2;

	const Circle = createCircle({
		get cx() {
			return center();
		},
		get cy() {
			return center();
		},
		get r() {
			return radius();
		}
	});

	return (
		<svg
			class={[ styles.moon, props.class ]}
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
				class={{
					[styles.semicircle]: true,
					[styles.visible]: visibleLeft()
				}}
				data-left
			/>
			<Circle
				class={{
					[styles.semicircle]: true,
					[styles.visible]: visibleRight()
				}}
				data-right
			/>
			<Circle
				class={{
					[styles.dark]: dark(),
					[styles.diff]: true
				}}
			/>
		</svg>
	);
}
