import { type JSX, splitProps } from "solid-js";
import { classnames } from "utils";

import styles from "./loader.module.css";

type Props = JSX.HTMLAttributes<HTMLDivElement>;

export function Loader(allProps: Props) {
	const [ props, rest ] = splitProps(allProps, [ "class" ]);

	return (
		<div class={classnames(styles.loader, props.class)} {...rest} />
	);
}
