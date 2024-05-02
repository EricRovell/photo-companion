import { type ParentProps, Show } from "solid-js";
import { Link as Anchor } from "ui-solid";
import { Dynamic } from "solid-js/web";

import { useDefinition } from "./markdown.context";
import type {
	HeadingProps,
	ListItemProps,
	ListProps,
	LinkProps,
	DefinitionProps,
	LinkReferenceProps
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
			url: props.url,
			title: props.title
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
			<Link url={data().url} title={data().title}>
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
		<Show when={"checked" in props} fallback={props.children}>
			<input type="checkbox" checked={props.checked ?? undefined} />
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
