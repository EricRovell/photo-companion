import { useMatch } from "@solidjs/router";
import { dynamic } from "@solidjs/web";

import type { Component } from "solid-js";

import { useTranslation } from "~/features/translation";
import { type IconProps, Text } from "~/shared/ui";

import { LinkQuery } from "../link-query";

import type { ROUTE_LABEL } from "../../consts";
interface NavigationItemProps {
	classes?: {
		icon?: string;
		label?: string;
		link?: string;
	};
	classNameIcon?: string;
	classNameLink?: string;
	href: string;
	icon: Component<IconProps>;
	label: ROUTE_LABEL;
}

export function NavigationItem(props: NavigationItemProps) {
	const Icon = dynamic(() => props.icon);
	const match = useMatch(() => props.href);
	const { t } = useTranslation();

	return (
		<LinkQuery
			aria-current={match() ? "page" : undefined}
			class={props.classes?.link}
			href={props.href}
		>
			<Icon class={props.classes?.icon} />
			<Text class={props.classes?.label} variant="text-s">
				{t().TITLE[props.label]}
			</Text>
		</LinkQuery>
	);
}
