import { classnames } from "utils";
import { splitProps } from "solid-js";

import type { LinkProps } from "./link.types";
import styles from "./link.module.css";

export function Link(allProps: LinkProps) {
	const [ props, rest ] = splitProps(allProps, [
		"class",
		"children",
		"href",
		"nofollow",
		"targetBlank"
	]);

	const external = () => props.href?.indexOf("://") !== -1;
	const target = () => (props.targetBlank || external()) ? "_blank" : undefined;
	const rel = () => (
		`${external() ? "noopener noreferrer" : ""}` +
		`${props.nofollow ? "nofollow" : ""}`
	);

	return (
		<a
			class={classnames(styles.link, props.class)}
			href={props.href}
			target={target()}
			rel={rel()}
			{...rest}
		>
			{props.children}
		</a>
	);
}
