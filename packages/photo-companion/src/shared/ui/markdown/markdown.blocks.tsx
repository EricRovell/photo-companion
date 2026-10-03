import { type ParentProps, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { Link as Anchor, Text, type TextVariant } from "~/shared/ui";

import { useDefinition } from "./markdown.context";

import type {
	DefinitionProps,
	HeadingProps,
	LinkProps,
	LinkReferenceProps,
	ListItemProps,
	ListProps
} from "./markdown.types";

import styles from "./markdown.module.css";

export const Definition = (props: DefinitionProps) => {
	const { setDefinitions } = useDefinition();

	// No need for reactivity here, just set the data
	// eslint-disable-next-line solid/reactivity
	setDefinitions(state => ({
		...state,
		[props.identifier]: {
			label: props.label,
			title: props.title,
			url: props.url
		}
	}));

	return <></>;
};

/**
 * TODO: wrap with <a href={`#${props.id}`} />
 */
const HEADING_ELEMENTS = {
	1: "h1",
	2: "h2",
	3: "h3",
	4: "h4",
	5: "h5",
	6: "h6"
} as const;

const HEADING_VARIANTS: Record<HeadingProps["depth"], TextVariant> = {
	1: "heading-4xl",
	2: "heading-3xl",
	3: "heading-l",
	4: "heading-m",
	5: "heading-s",
	6: "heading-xs"
};

export const Heading = (props: HeadingProps) => (
	<Text align="start" as={HEADING_ELEMENTS[props.depth]} balance color="primary" id={props.id} variant={HEADING_VARIANTS[props.depth]}>
		{props.children}
	</Text>
);

export const Link = (props: LinkProps) => (
	<Anchor href={props.url} title={props.title ?? undefined}>
		{props.children}
	</Anchor>
);

export const LinkReference = (props: LinkReferenceProps) => {
	const { getDefinitions } = useDefinition();
	const data = () => getDefinitions()[props.identifier];

	return (
		<Show when={data()}>
			<Link title={data().title} url={data().url}>
				{props.children}
			</Link>
		</Show>
	);
};

export const List = (props: ListProps) => (
	<Dynamic
		component={props.ordered ? "ol" : "ul"}
		start={props.start ?? undefined}
	>
		{props.children}
	</Dynamic>
);

export const ListItem = (props: ListItemProps) => (
	<li>
		<Show fallback={props.children} when={"checked" in props}>
			<input checked={props.checked ?? undefined} type="checkbox" />
			{props.children}
		</Show>
	</li>
);

export const Paragraph = (props: ParentProps) => (
	<Text align="start" as="p" variant="text-l">{props.children}</Text>
);

export const Root = (props: ParentProps) => (
	<Text as="article" class={styles.article} variant="text-l">
		{props.children}
	</Text>
);

export const Strong = (props: ParentProps) => (
	<Text as="strong" variant="heading-l">{props.children}</Text>
);
