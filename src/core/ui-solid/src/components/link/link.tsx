import { classnames } from "utils";
import { splitProps } from "solid-js";

import type { LinkProps } from "./link.types";
import styles from "./link.module.css";
import { isNonEmptyString } from "utils/validators";

export function Link(allProps: LinkProps) {
	const [ props, rest ] = splitProps(allProps, [
		"class",
		"children",
		"href",
		"nofollow",
		"targetBlank",
		"query"
	]);

	const href = () => {
		if (!props.query) {
			return props.href;
		}

		if (isNonEmptyString(props.query)) {
			return `${props.href}${props.query}`;
		}

		return `${props.href}?${props.query.toString()}`;
	};

	const external = () => props.href?.indexOf("://") !== -1;
	const target = () => (props.targetBlank || external()) ? "_blank" : undefined;
	const rel = () => (
		`${external() ? "noopener noreferrer" : ""}` +
		`${props.nofollow ? "nofollow" : ""}`
	);

	return (
		<a
			class={classnames(styles.link, props.class)}
			data-external={external() ? "" : undefined}
			href={href()}
			target={target()}
			rel={rel()}
			{...rest}
		>
			{props.children}
		</a>
	);
}
