import { type ParentProps } from "solid-js";
import { MDXProvider } from "solid-marked";

import {
	Definition,
	Heading,
	Link,
	LinkReference,
	List,
	ListItem,
	Paragraph,
	Root,
	Strong
} from "@lib/components/markdown/markdown.blocks";
import { DefinitionProvider } from "./markdown.context";

export const Markdown = (props: ParentProps) => (
	<DefinitionProvider>
		<MDXProvider builtins={{
			Definition,
			Heading,
			Link,
			LinkReference,
			List,
			ListItem,
			Paragraph,
			Root,
			Strong
		}}>
			{props.children}
		</MDXProvider>
	</DefinitionProvider>
);
