import { omit } from "solid-js";

import type { JSX } from "@solidjs/web";

import styles from "./loader.module.css";

type Props = JSX.HTMLAttributes<HTMLDivElement>;

export function Loader(props: Props) {
	const rest = omit(props, "class");

	return (
		<div class={[ styles.loader, props.class ]} {...rest} />
	);
}
