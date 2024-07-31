import { type JSX, splitProps } from "solid-js";
import { classnames } from "utils";
import { isNonEmptyString, isNullable } from "utils/validators";

import styles from "./link.module.css";

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	block?: boolean;
	nofollow?: boolean;
	query?: string | URLSearchParams;
}

export function Link(allProps: LinkProps) {
	const [ props, rest ] = splitProps(allProps, [
		"class",
		"children",
		"href",
		"nofollow",
		"target",
		"query"
	]);

	const href = () => {
		if (isNullable(props.query)) {
			return props.href;
		}

		if (isNonEmptyString(props.query)) {
			return `${props.href}${props.query}`;
		}

		return `${props.href}?${props.query.toString()}`;
	};

	const external = () => Boolean(props.href?.includes("://"));
	const target = () => (props.target !== "_blank" && external()) ? "_blank" : undefined;

	const rel = () => classnames(
		external() && "noopener noreferrer",
		props.nofollow && "nofollow"
	);

	return (
		<a
			class={classnames(styles.link, props.class)}
			data-external={external() ? "" : undefined}
			href={href()}
			rel={rel()}
			target={target()}
			{...rest}
		>
			{props.children}
		</a>
	);
}
