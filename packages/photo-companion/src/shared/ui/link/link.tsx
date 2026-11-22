import { omit } from "solid-js";
import { isNonEmptyString, isNullable } from "utils/validators";

import type { JSX } from "@solidjs/web";

import styles from "./link.module.css";

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	block?: boolean;
	nofollow?: boolean;
	query?: string | URLSearchParams;
}

export function Link(props: LinkProps) {
	const rest = omit(props, "class",
		"children",
		"href",
		"nofollow",
		"target",
		"query"
	);

	const href = () => {
		if (isNullable(props.query)) {
			return props.href;
		}

		if (isNonEmptyString(props.query)) {
			return `${props.href}${props.query}`;
		}

		return `${props.href}?${props.query.toString()}`;
	};

	const external = () => typeof props.href === "string" && props.href.includes("://");
	const target = () => (props.target !== "_blank" && external()) ? "_blank" : undefined;

	const rel = () => [
		external() && "noopener noreferrer",
		props.nofollow && "nofollow"
	].filter(Boolean).join(" ");

	return (
		<a
			class={[ styles.link, props.class ]}
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
