import { type ParentProps, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { Link as Anchor } from "~/shared/ui";

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
export const Heading = (props: HeadingProps) => (
	<Dynamic component={`h${props.depth}`} id={props.id}>
		{props.children}
	</Dynamic>
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
	<p>{props.children}</p>
);

export const Root = (props: ParentProps) => (
	<article class={styles.article}>
		{props.children}
	</article>
);

export const Strong = (props: ParentProps) => (
	<strong>{props.children}</strong>
);
