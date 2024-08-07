import { type JSX, mergeProps, Show, splitProps } from "solid-js";
import { classnames, setAttribute } from "utils";

import styles from "./bulb.module.css";

interface Props extends JSX.SvgSVGAttributes<SVGSVGElement> {
	glow?: boolean;
	hoverGlow?: boolean;
	title?: string;
}

const DEFAULT_PROPS: Props = {
	glow: false,
	hoverGlow: false
};

export const Bulb = (allProps: Props) => {
	const mergedProps = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(mergedProps, [ "class", "hoverGlow", "glow", "title" ]);

	return (
		<svg
			class={classnames(styles.bulb, props.class)}
			data-glow={setAttribute(props.glow)}
			data-hover-glow={setAttribute(props.hoverGlow)}
			viewBox="0 0 128 128"
			{...rest}
		>
			<Show when={props.title}>
				<title>{props.title}</title>
			</Show>
			<path d="m51.63,110.95l.99,3.66,3.26.98,22.16-13.29v-7.19l-26.41,15.84Zm24.21-28.9l-25.88,15.53v7.19l27.19-16.31-1.32-6.4Z" fill="#B0BEC5"/>
			<path class={styles.wire} d="m78.38,35.25c-5.94,0-10.78,4.84-10.78,10.78v3.59h-7.19v-3.59c0-5.94-4.84-10.78-10.78-10.78s-10.78,4.84-10.78,10.78,4.84,10.78,10.78,10.78h3.59v21.56c0,1.99,1.61,3.59,3.59,3.59s3.59-1.61,3.59-3.59v-21.56h7.19v21.56c0,1.99,1.61,3.59,3.59,3.59s3.59-1.61,3.59-3.59v-21.56h3.59c5.94,0,10.78-4.84,10.78-10.78s-4.84-10.78-10.78-10.78Zm-28.75,14.38c-1.98,0-3.59-1.61-3.59-3.59s1.61-3.59,3.59-3.59,3.59,1.61,3.59,3.59v3.59h-3.59Zm28.75,0h-3.59v-3.59c0-1.98,1.61-3.59,3.59-3.59s3.59,1.61,3.59,3.59-1.61,3.59-3.59,3.59Z" fill="#61616b"/>
			<path d="m87.65,77.7l-5.88-1.29c-.16-1.04-6.99,1.31-6.99,1.97v28.75c0,3.97-3.23,7.19-7.19,7.19h-7.19c-3.97,0-7.19-3.22-7.19-7.19v-28.75c0-.66-6.84-3-6.99-1.97l-5.88,1.29-.04.04c3.45,2.63,5.72,6.74,5.72,11.41v17.97c0,7.94,6.44,14.38,14.38,14.38h7.19c7.94,0,14.38-6.44,14.38-14.38v-17.97c0-4.67,2.27-8.78,5.72-11.41l-.04-.04Z" fill="#546E7A"/>
			<path class={styles.glass} d="m64,13.69c17.84,0,32.34,14.51,32.34,32.34s-14.51,32.34-32.34,32.34-32.34-14.51-32.34-32.34S46.16,13.69,64,13.69m0-7.19c-21.83,0-39.53,17.7-39.53,39.53s17.7,39.53,39.53,39.53,39.53-17.7,39.53-39.53S85.83,6.5,64,6.5h0Z" fill="#546E7A"/>
		</svg>
	);
};
