/**
 * types are taken from:
 * "node_modules/solid-marked/dist/types/compiler/interfaces";
 */

import type { ParentProps } from "solid-js";

export interface HeadingProps extends ParentProps {
	depth: 1 | 2 | 3 | 4 | 5 | 6;
	id: string;
}

export interface ListProps extends ParentProps {
	ordered?: boolean | null | undefined;
	spread?: boolean | null | undefined;
	start?: number | null | undefined;
}

export interface ListItemProps extends ParentProps {
	checked?: boolean | null | undefined;
	spread?: boolean | null | undefined;
}

export interface LinkProps extends ParentProps {
	url: string;
	title?: string | null | undefined;
}

export interface DefinitionProps {
	identifier: string;
	label?: string | null | undefined;
	url: string;
	title?: string | null | undefined;
}

export interface LinkReferenceProps extends ParentProps {
	identifier: string;
	label?: string | null | undefined;
	referenceType: "shortcut" | "collapsed" | "full";
}
