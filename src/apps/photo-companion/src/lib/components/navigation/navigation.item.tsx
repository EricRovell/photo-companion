import { useMatch } from "@solidjs/router";
import { Dynamic } from "solid-js/web";

import type { Component } from "solid-js";
import type { IconProps } from "ui";

import { useTranslation } from "@lib/context";

import { LinkQuery } from "../link-query";

import type { ROUTE_LABEL } from "@lib/consts/routes";

interface NavigationItemProps {
	classes?: {
		icon?: string;
		link?: string;
	};
	classNameIcon?: string;
	classNameLink?: string;
	href: string;
	icon: Component<IconProps>;
	label: ROUTE_LABEL;
}

export function NavigationItem(props: NavigationItemProps) {
	const match = useMatch(() => props.href);
	const { t } = useTranslation();

	return (
		<LinkQuery
			aria-current={match() ? "page" : undefined}
			class={props.classes?.link}
			href={props.href}
		>
			<Dynamic class={props.classes?.icon} component={props.icon} />
			<span>{t().TITLE[props.label]}</span>
		</LinkQuery>
	);
}
