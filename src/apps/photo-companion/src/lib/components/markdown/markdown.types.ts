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
	start?: null | number | undefined;
}

export interface ListItemProps extends ParentProps {
	checked?: boolean | null | undefined;
	spread?: boolean | null | undefined;
}

export interface LinkProps extends ParentProps {
	title?: null | string | undefined;
	url: string;
}

export interface DefinitionProps {
	identifier: string;
	label?: null | string | undefined;
	title?: null | string | undefined;
	url: string;
}

export interface LinkReferenceProps extends ParentProps {
	identifier: string;
	label?: null | string | undefined;
	referenceType: "collapsed" | "full" | "shortcut";
}
